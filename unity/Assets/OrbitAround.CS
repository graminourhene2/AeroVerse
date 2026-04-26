using UnityEngine;

public class OrbitAround : MonoBehaviour
{
    [Header("Orbit Settings")]
    [Tooltip("The object to orbit around (e.g., Earth)")]
    public Transform orbitTarget;

    [Tooltip("How fast to orbit (degrees per second)")]
    public float orbitSpeed = 30f;

    [Tooltip("Distance from the orbit target")]
    public float orbitRadius = 5f;

    [Tooltip("Orbit on horizontal plane (XZ) or vertical (XY)")]
    public OrbitPlane orbitPlane = OrbitPlane.Horizontal;

    [Header("Optional Settings")]
    [Tooltip("Start at a random position in orbit")]
    public bool randomStartPosition = false;

    [Tooltip("Rotate the object while orbiting (like Moon showing same face)")]
    public bool rotateWhileOrbiting = true;

    private float currentAngle = 0f;

    public enum OrbitPlane
    {
        Horizontal,  // XZ plane (around Y axis)
        Vertical     // XY plane (around Z axis)
    }

    void Start()
    {
        // If no target specified, try to use parent
        if (orbitTarget == null && transform.parent != null)
        {
            orbitTarget = transform.parent;
        }

        // Start at random angle if enabled
        if (randomStartPosition)
        {
            currentAngle = Random.Range(0f, 360f);
        }

        // Set initial position
        UpdatePosition();
    }

    void Update()
    {
        if (orbitTarget == null)
        {
            Debug.LogWarning(gameObject.name + " has no orbit target!");
            return;
        }

        // Increase angle based on speed and time
        currentAngle += orbitSpeed * Time.deltaTime;

        // Keep angle between 0-360
        if (currentAngle >= 360f)
            currentAngle -= 360f;

        // Update position
        UpdatePosition();

        // Rotate to face direction of movement (optional)
        if (rotateWhileOrbiting)
        {
            transform.LookAt(orbitTarget);
        }
    }

    void UpdatePosition()
    {
        if (orbitTarget == null) return;

        // Convert angle to radians
        float angleInRadians = currentAngle * Mathf.Deg2Rad;

        Vector3 newPosition;

        if (orbitPlane == OrbitPlane.Horizontal)
        {
            // Orbit around Y axis (horizontal plane)
            float x = Mathf.Cos(angleInRadians) * orbitRadius;
            float z = Mathf.Sin(angleInRadians) * orbitRadius;

            newPosition = orbitTarget.position + new Vector3(x, 0, z);
        }
        else
        {
            // Orbit around Z axis (vertical plane)
            float x = Mathf.Cos(angleInRadians) * orbitRadius;
            float y = Mathf.Sin(angleInRadians) * orbitRadius;

            newPosition = orbitTarget.position + new Vector3(x, y, 0);
        }

        transform.position = newPosition;
    }

    // Draw the orbit path in Scene view for visualization
    void OnDrawGizmos()
    {
        if (orbitTarget == null) return;

        Gizmos.color = Color.cyan;

        // Draw orbit circle
        int segments = 64;
        float angleStep = 360f / segments;

        for (int i = 0; i < segments; i++)
        {
            float angle1 = i * angleStep * Mathf.Deg2Rad;
            float angle2 = (i + 1) * angleStep * Mathf.Deg2Rad;

            Vector3 point1, point2;

            if (orbitPlane == OrbitPlane.Horizontal)
            {
                point1 = orbitTarget.position + new Vector3(
                    Mathf.Cos(angle1) * orbitRadius,
                    0,
                    Mathf.Sin(angle1) * orbitRadius
                );
                point2 = orbitTarget.position + new Vector3(
                    Mathf.Cos(angle2) * orbitRadius,
                    0,
                    Mathf.Sin(angle2) * orbitRadius
                );
            }
            else
            {
                point1 = orbitTarget.position + new Vector3(
                    Mathf.Cos(angle1) * orbitRadius,
                    Mathf.Sin(angle1) * orbitRadius,
                    0
                );
                point2 = orbitTarget.position + new Vector3(
                    Mathf.Cos(angle2) * orbitRadius,
                    Mathf.Sin(angle2) * orbitRadius,
                    0
                );
            }

            Gizmos.DrawLine(point1, point2);
        }
    }
}