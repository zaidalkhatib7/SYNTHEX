param(
    [Parameter(Mandatory = $true)]
    [string]$InventoryPath,

    [Parameter(Mandatory = $true)]
    [string]$InputDirectory,

    [Parameter(Mandatory = $true)]
    [string]$OutputPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$inventory = Import-Csv -LiteralPath $InventoryPath
$inputPath = (Resolve-Path -LiteralPath $InputDirectory).Path
$targetIds = 25..37
$results = New-Object System.Collections.Generic.List[object]

foreach ($item in $inventory | Where-Object { $targetIds -contains [int]$_.id }) {
    $sourcePath = Join-Path $inputPath $item.relative_path
    $source = [System.Drawing.Image]::FromFile($sourcePath)
    $sample = New-Object System.Drawing.Bitmap(128, 128)
    $graphics = [System.Drawing.Graphics]::FromImage($sample)

    try {
        $graphics.DrawImage(
            $source,
            (New-Object System.Drawing.Rectangle(0, 0, $sample.Width, $sample.Height))
        )

        $buckets = @{}

        for ($x = 0; $x -lt $sample.Width; $x++) {
            for ($y = 0; $y -lt $sample.Height; $y++) {
                $pixel = $sample.GetPixel($x, $y)
                $luma = (0.2126 * $pixel.R) + (0.7152 * $pixel.G) + (0.0722 * $pixel.B)

                if ($luma -lt 18 -or $luma -gt 242) {
                    continue
                }

                $max = [math]::Max($pixel.R, [math]::Max($pixel.G, $pixel.B))
                $min = [math]::Min($pixel.R, [math]::Min($pixel.G, $pixel.B))
                $chroma = $max - $min

                if ($chroma -lt 12 -and $luma -lt 70) {
                    continue
                }

                $r = [math]::Min(255, [int]([math]::Round($pixel.R / 24) * 24))
                $g = [math]::Min(255, [int]([math]::Round($pixel.G / 24) * 24))
                $b = [math]::Min(255, [int]([math]::Round($pixel.B / 24) * 24))
                $key = '#{0:X2}{1:X2}{2:X2}' -f $r, $g, $b

                if ($buckets.ContainsKey($key)) {
                    $buckets[$key]++
                }
                else {
                    $buckets[$key] = 1
                }
            }
        }

        $rank = 0
        foreach ($entry in $buckets.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 8) {
            $rank++
            $results.Add([pscustomobject]@{
                id = [int]$item.id
                filename = $item.filename
                rank = $rank
                color = $entry.Key
                sampled_pixels = $entry.Value
            })
        }
    }
    finally {
        $graphics.Dispose()
        $sample.Dispose()
        $source.Dispose()
    }
}

$results | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding utf8
$results | Format-Table id,rank,color,sampled_pixels,filename -AutoSize
