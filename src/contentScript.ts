let isHighlighting = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startTracking') {
    enableHighlighting();
  } else if (request.action === 'stopTracking') {
    disableHighlighting();
  }
});

function enableHighlighting() {
  isHighlighting = true;
  document.addEventListener('mouseup', handleHighlight);
}

function disableHighlighting() {
  isHighlighting = false;
  document.removeEventListener('mouseup', handleHighlight);
}

function handleHighlight() {
  if (!isHighlighting) return;

  const selection = window.getSelection();
  if (selection && !selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.className = 'research-highlight';
    span.style.backgroundColor = 'yellow';
    range.surroundContents(span);

    const highlightedText = selection.toString();
    chrome.runtime.sendMessage({
      action: 'addHighlight',
      data: {
        text: highlightedText,
        url: window.location.href
      }
    });
  }
}