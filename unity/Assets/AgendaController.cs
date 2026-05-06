using UnityEngine;

public class AgenaController : MonoBehaviour
{
    [Header("Rotation")]
    public float rotationSpeed = 10f;

    [Header("Orbit Settings")]
    public Transform orbitCenter;
    public float orbitSpeed = 20f;

    [Header("Docking Settings")]
    public Transform playerCamera;
    public float dockingSpeed = 2f;
    private bool docking = false;

    [Header("Antennas / Panels")]
    public Transform[] rotatingParts;   // assign child objects here
    public float partRotationSpeed = 30f;

    [Header("Navigation Lights")]
    public Light[] navLights;           // assign point/spot lights here
    public float blinkSpeed = 2f;

    [Header("Radio Transmission")]
    public AudioSource radio;           // assign audio source with clip

    void Update()
    {
        // 1. Rotate whole Agena
        transform.Rotate(Vector3.up * rotationSpeed * Time.deltaTime);

        // 2. Orbit around center
        if (orbitCenter != null)
        {
            transform.RotateAround(orbitCenter.position, Vector3.up, orbitSpeed * Time.deltaTime);
        }

        // 3. Docking behavior
        if (docking && playerCamera != null)
        {
            transform.position = Vector3.Lerp(
                transform.position,
                playerCamera.position + playerCamera.forward * 5f,
                Time.deltaTime * dockingSpeed
            );
            transform.rotation = Quaternion.Lerp(
                transform.rotation,
                playerCamera.rotation,
                Time.deltaTime * dockingSpeed
            );
        }

        // 4. Rotate antennas/panels
        if (rotatingParts != null)
        {
            foreach (Transform part in rotatingParts)
            {
                if (part != null)
                    part.Rotate(Vector3.up * partRotationSpeed * Time.deltaTime);
            }
        }

        // 5. Blink navigation lights
        if (navLights != null)
        {
            foreach (Light light in navLights)
            {
                if (light != null)
                    light.enabled = Mathf.Sin(Time.time * blinkSpeed) > 0;
            }
        }
    }

    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            docking = true;

            // Play radio when docking starts
            if (radio != null && !radio.isPlaying)
            {
                radio.Play();
            }
        }
    }
}
