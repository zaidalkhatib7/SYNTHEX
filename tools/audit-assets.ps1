param(
    [Parameter(Mandatory = $true)]
    [string]$InputDirectory,

    [Parameter(Mandatory = $true)]
    [string]$OutputDirectory
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$inputPath = (Resolve-Path -LiteralPath $InputDirectory).Path
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$outputPath = (Resolve-Path -LiteralPath $OutputDirectory).Path

function Get-Orientation {
    param([int]$Width, [int]$Height)

    if ($Width -eq $Height) {
        return 'square'
    }

    if ($Width -gt $Height) {
        return 'landscape'
    }

    return 'portrait'
}

function Get-SampledColor {
    param([System.Drawing.Bitmap]$Bitmap)

    $sampleSize = 24
    $sample = New-Object System.Drawing.Bitmap($sampleSize, $sampleSize)
    $graphics = [System.Drawing.Graphics]::FromImage($sample)

    try {
        $graphics.DrawImage(
            $Bitmap,
            (New-Object System.Drawing.Rectangle(0, 0, $sampleSize, $sampleSize))
        )

        [long]$red = 0
        [long]$green = 0
        [long]$blue = 0
        [long]$count = 0

        for ($x = 0; $x -lt $sampleSize; $x++) {
            for ($y = 0; $y -lt $sampleSize; $y++) {
                $pixel = $sample.GetPixel($x, $y)
                $red += $pixel.R
                $green += $pixel.G
                $blue += $pixel.B
                $count++
            }
        }

        $r = [int][math]::Round($red / $count)
        $g = [int][math]::Round($green / $count)
        $b = [int][math]::Round($blue / $count)
        return '#{0:X2}{1:X2}{2:X2}' -f $r, $g, $b
    }
    finally {
        $graphics.Dispose()
        $sample.Dispose()
    }
}

$supportedExtensions = @('.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tif', '.tiff')
$files = Get-ChildItem -LiteralPath $inputPath -Recurse -File |
    Where-Object { $supportedExtensions -contains $_.Extension.ToLowerInvariant() } |
    Sort-Object FullName

$inventory = New-Object System.Collections.Generic.List[object]
$index = 0

foreach ($file in $files) {
    $index++
    $image = [System.Drawing.Image]::FromFile($file.FullName)

    try {
        $bitmap = New-Object System.Drawing.Bitmap($image)

        try {
            $hash = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
            $relativePath = $file.FullName.Substring($inputPath.Length).TrimStart(
                [System.IO.Path]::DirectorySeparatorChar,
                [System.IO.Path]::AltDirectorySeparatorChar
            )

            $inventory.Add([pscustomobject]@{
                id = $index
                filename = $file.Name
                relative_path = $relativePath
                extension = $file.Extension.TrimStart('.').ToLowerInvariant()
                bytes = $file.Length
                size_kb = [math]::Round($file.Length / 1KB, 1)
                width = $image.Width
                height = $image.Height
                megapixels = [math]::Round(($image.Width * $image.Height) / 1000000, 2)
                orientation = Get-Orientation -Width $image.Width -Height $image.Height
                aspect_ratio = [math]::Round($image.Width / $image.Height, 3)
                horizontal_dpi = [math]::Round($image.HorizontalResolution, 1)
                vertical_dpi = [math]::Round($image.VerticalResolution, 1)
                pixel_format = $image.PixelFormat.ToString()
                sampled_average_color = Get-SampledColor -Bitmap $bitmap
                sha256 = $hash
                exact_duplicate = $false
            })
        }
        finally {
            $bitmap.Dispose()
        }
    }
    finally {
        $image.Dispose()
    }
}

$duplicateGroups = @($inventory | Group-Object sha256 | Where-Object Count -gt 1)
foreach ($group in $duplicateGroups) {
    foreach ($item in $group.Group) {
        $item.exact_duplicate = $true
    }
}

$inventory |
    Export-Csv -LiteralPath (Join-Path $outputPath 'asset-inventory.csv') -NoTypeInformation -Encoding utf8

$inventory |
    ConvertTo-Json -Depth 4 |
    Set-Content -LiteralPath (Join-Path $outputPath 'asset-inventory.json') -Encoding utf8

$duplicateGroups |
    ForEach-Object {
        [pscustomobject]@{
            sha256 = $_.Name
            count = $_.Count
            files = ($_.Group.relative_path -join ' | ')
        }
    } |
    Export-Csv -LiteralPath (Join-Path $outputPath 'exact-duplicates.csv') -NoTypeInformation -Encoding utf8

$columns = 4
$rows = 3
$cellWidth = 420
$cellHeight = 310
$padding = 16
$labelHeight = 54
$sheetWidth = $columns * $cellWidth
$sheetHeight = $rows * $cellHeight
$itemsPerSheet = $columns * $rows
$sheetCount = [math]::Ceiling($inventory.Count / $itemsPerSheet)

for ($sheetIndex = 0; $sheetIndex -lt $sheetCount; $sheetIndex++) {
    $sheet = New-Object System.Drawing.Bitmap($sheetWidth, $sheetHeight)
    $graphics = [System.Drawing.Graphics]::FromImage($sheet)

    try {
        $graphics.Clear([System.Drawing.Color]::FromArgb(14, 18, 23))
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $font = New-Object System.Drawing.Font('Arial', 11, [System.Drawing.FontStyle]::Regular)
        $idFont = New-Object System.Drawing.Font('Arial', 14, [System.Drawing.FontStyle]::Bold)
        $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 238, 244))
        $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(154, 171, 184))
        $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(53, 68, 79), 1)

        try {
            for ($slot = 0; $slot -lt $itemsPerSheet; $slot++) {
                $itemIndex = ($sheetIndex * $itemsPerSheet) + $slot
                if ($itemIndex -ge $inventory.Count) {
                    break
                }

                $item = $inventory[$itemIndex]
                $column = $slot % $columns
                $row = [math]::Floor($slot / $columns)
                $cellX = $column * $cellWidth
                $cellY = $row * $cellHeight
                $imageX = $cellX + $padding
                $imageY = $cellY + $padding
                $maxWidth = $cellWidth - ($padding * 2)
                $maxHeight = $cellHeight - $labelHeight - ($padding * 2)

                $source = [System.Drawing.Image]::FromFile((Join-Path $inputPath $item.relative_path))

                try {
                    $scale = [math]::Min($maxWidth / $source.Width, $maxHeight / $source.Height)
                    $drawWidth = [math]::Round($source.Width * $scale)
                    $drawHeight = [math]::Round($source.Height * $scale)
                    $drawX = $imageX + [math]::Round(($maxWidth - $drawWidth) / 2)
                    $drawY = $imageY + [math]::Round(($maxHeight - $drawHeight) / 2)

                    $graphics.DrawImage(
                        $source,
                        (New-Object System.Drawing.Rectangle($drawX, $drawY, $drawWidth, $drawHeight))
                    )
                    $graphics.DrawRectangle($borderPen, $drawX, $drawY, $drawWidth, $drawHeight)
                }
                finally {
                    $source.Dispose()
                }

                $labelY = $cellY + $cellHeight - $labelHeight + 2
                $graphics.DrawString(('#{0:00}' -f $item.id), $idFont, $textBrush, $imageX, $labelY)
                $graphics.DrawString(
                    ('{0} x {1} | {2} KB' -f $item.width, $item.height, $item.size_kb),
                    $font,
                    $mutedBrush,
                    $imageX + 48,
                    $labelY + 3
                )
                $shortName = if ($item.filename.Length -gt 45) {
                    $item.filename.Substring(0, 42) + '...'
                }
                else {
                    $item.filename
                }
                $graphics.DrawString($shortName, $font, $textBrush, $imageX, $labelY + 25)
            }

            $sheetFile = Join-Path $outputPath ('contact-sheet-{0:00}.jpg' -f ($sheetIndex + 1))
            $sheet.Save($sheetFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        }
        finally {
            $font.Dispose()
            $idFont.Dispose()
            $textBrush.Dispose()
            $mutedBrush.Dispose()
            $borderPen.Dispose()
        }
    }
    finally {
        $graphics.Dispose()
        $sheet.Dispose()
    }
}

$summary = [pscustomobject]@{
    input_directory = $inputPath
    image_count = $inventory.Count
    total_bytes = ($inventory | Measure-Object bytes -Sum).Sum
    formats = $inventory | Group-Object extension | ForEach-Object {
        [pscustomobject]@{ format = $_.Name; count = $_.Count }
    }
    orientations = $inventory | Group-Object orientation | ForEach-Object {
        [pscustomobject]@{ orientation = $_.Name; count = $_.Count }
    }
    exact_duplicate_groups = $duplicateGroups.Count
    contact_sheets = $sheetCount
}

$summary |
    ConvertTo-Json -Depth 5 |
    Set-Content -LiteralPath (Join-Path $outputPath 'asset-summary.json') -Encoding utf8

$summary | ConvertTo-Json -Depth 5
