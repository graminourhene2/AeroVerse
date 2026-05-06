using UnityEngine;

public class MoonOrbit : MonoBehaviour
{
    [Header("Orbit Settings")]
    public Transform earth;       // Drag Earth here
    public float orbitSpeed = 10f; // Degrees per second

    [Header("Rotation Settings")]
    public float rotationSpeed = 5f; // Moon’s own spin

    void Update()
    {
        if (earth != null)
        {
            // Orbit around Earth
            transform.RotateAround(earth.position, Vector3.up, orbitSpeed * Time.deltaTime);
        }

        // Rotate on its own axis
        transform.Rotate(Vector3.up * rotationSpeed * Time.deltaTime);
    }
}
