using UnityEngine;
using System.Runtime.InteropServices;

public class ObjectClickDetector : MonoBehaviour
{
    // Import JavaScript function
    [DllImport("__Internal")]
    private static extern void SendObjectToReact(string objectName);

    // CV Mode state
    private bool cvModeActive = false;

    void Update()
    {
        // Only detect clicks when CV mode is active
        if (!cvModeActive) return;

        // Detect mouse click
        if (Input.GetMouseButtonDown(0))
        {
            DetectClickedObject();
        }
    }

    void DetectClickedObject()
    {
        // Create a ray from camera through mouse position
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        RaycastHit hit;

        // Check if ray hits any object with a collider
        if (Physics.Raycast(ray, out hit))
        {
            GameObject clickedObject = hit.collider.gameObject;
            string objectName = clickedObject.name;

            Debug.Log("[Unity CV] Clicked on: " + objectName);

            // Send to React/JavaScript
            #if UNITY_WEBGL && !UNITY_EDITOR
                SendObjectToReact(objectName);
            #else
                Debug.Log("[Unity CV] Would send to React: " + objectName);
            #endif
        }
        else
        {
            Debug.Log("[Unity CV] Clicked on empty space");
            
            #if UNITY_WEBGL && !UNITY_EDITOR
                SendObjectToReact("Unknown");
            #endif
        }
    }

    // Called from JavaScript to toggle CV mode
    public void SetCVMode(string active)
    {
        cvModeActive = (active == "true" || active == "1");
        Debug.Log("[Unity CV] Mode set to: " + cvModeActive);
    }
}