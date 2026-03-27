using UnityEngine;

public class AntennaInteractable : MonoBehaviour
{
    [Header("Rotation Settings")]
    public float rotationSpeed = 20f;
    private bool isRotating = true;

    [Header("Info Panel")]
    public GameObject infoPanel; // assign in Inspector

    private Renderer rend;
    private Color originalColor;

    void Start()
    {
        rend = GetComponent<Renderer>();
        if (rend != null)
        {
            originalColor = rend.material.color;
        }

        if (infoPanel != null)
        {
            infoPanel.SetActive(false);
        }
    }

    void Update()
    {
        if (isRotating)
        {
            transform.Rotate(Vector3.up * rotationSpeed * Time.deltaTime);
        }
    }

    void OnMouseDown()
    {
        // Toggle rotation
        isRotating = !isRotating;

        // Toggle info panel
        if (infoPanel != null)
        {
            infoPanel.SetActive(!infoPanel.activeSelf);
        }
    }

    void OnMouseEnter()
    {
        // Highlight on hover
        if (rend != null)
        {
            rend.material.color = Color.yellow;
        }
    }

    void OnMouseExit()
    {
        // Back to original color
        if (rend != null)
        {
            rend.material.color = originalColor;
        }
    }
}