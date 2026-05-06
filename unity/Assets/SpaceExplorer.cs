using UnityEngine;

public class SpaceExplorer : MonoBehaviour
{
    private SpaceObject currentObject;

    void Update()
    {
        HandleClick();
    }

    void HandleClick()
    {
        if (Input.GetMouseButtonDown(0))
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;

            if (Physics.Raycast(ray, out hit))
            {
                SpaceObject obj = hit.transform.GetComponent<SpaceObject>();

                if (obj != null)
                {
                    // If clicking a NEW object
                    if (currentObject != null && currentObject != obj)
                    {
                        currentObject.ToggleInteraction(); // turn off old one
                    }

                    obj.ToggleInteraction();
                    currentObject = obj;
                }
            }
        }
    }
}