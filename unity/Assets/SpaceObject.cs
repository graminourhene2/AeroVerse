using UnityEngine;

public class SpaceObject : MonoBehaviour
{
    [Header("Rotation")]
    public float rotationSpeed = 20f;

    private bool isActive = false;

    void Update()
    {
        if (isActive)
        {
            transform.Rotate(Vector3.up * rotationSpeed * Time.deltaTime);
        }
    }

    public void ToggleInteraction()
    {
        isActive = !isActive;
    }
}
