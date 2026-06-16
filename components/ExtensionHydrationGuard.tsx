const guardSource = String.raw`
(() => {
  const attributeNames = [
    "bis_skin_checked",
    "bis_register",
    "__processed_67012a90-f8d6-4c88-b6a8-2530ef4d96c9__",
  ];
  const scriptAttributeNames = [
    "bis_use",
    "data-dynamic-id",
    "src",
    "type",
  ];
  const extensionScriptProtocols = [
    "chrome-extension://",
    "edge-extension://",
    "moz-extension://",
    "safari-web-extension://",
  ];

  const cleanElement = (element) => {
    for (const attributeName of attributeNames) {
      element.removeAttribute(attributeName);
    }
  };

  const removeInjectedScript = (element) => {
    if (!(element instanceof HTMLScriptElement)) {
      return false;
    }

    const source = element.getAttribute("src") ?? "";
    const isExtensionScript = extensionScriptProtocols.some((protocol) =>
      source.startsWith(protocol),
    );
    const hasExtensionMarkers =
      element.hasAttribute("bis_use") ||
      element.hasAttribute("data-dynamic-id");

    if (isExtensionScript || (source && hasExtensionMarkers)) {
      element.remove();
      return true;
    }

    return false;
  };

  const cleanTree = (root) => {
    if (root.nodeType === Node.ELEMENT_NODE) {
      if (removeInjectedScript(root)) {
        return;
      }

      cleanElement(root);
    }

    root.querySelectorAll?.(
      attributeNames.map((name) => "[" + name + "]").join(","),
    ).forEach(cleanElement);

    root.querySelectorAll?.("script[src], script[bis_use], script[data-dynamic-id]")
      .forEach(removeInjectedScript);
  };

  cleanTree(document);

  new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "attributes") {
        if (!removeInjectedScript(record.target)) {
          cleanElement(record.target);
        }
        continue;
      }

      record.addedNodes.forEach(cleanTree);
    }
  }).observe(document, {
    attributeFilter: [...attributeNames, ...scriptAttributeNames],
    attributes: true,
    childList: true,
    subtree: true,
  });
})();
`;

export function ExtensionHydrationGuard() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <script
      data-extension-hydration-guard
      dangerouslySetInnerHTML={{ __html: guardSource }}
    />
  );
}
