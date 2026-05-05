mergeInto(LibraryManager.library, {
  SendObjectToReact: function (objectNamePtr) {
    // Convert C# string pointer to JavaScript string
    var objectName = UTF8ToString(objectNamePtr);
    
    console.log('[Unity Raycast → React] Object clicked:', objectName);
    
    // Call global React function
    if (window.onUnityObjectClicked) {
      window.onUnityObjectClicked(objectName);
    } else {
      console.warn('[Unity Raycast] React handler not found');
    }
  }
});