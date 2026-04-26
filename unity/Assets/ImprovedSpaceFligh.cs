using UnityEngine;

public class ImprovedSpaceFlight : MonoBehaviour
{
    [Header("Movement Settings")]
    public float swimSpeed = 25f;
    public float sprintSpeed = 60f;
    public float smoothTime = 0.15f;
    public float inertia = 0.88f; // Makes movement floaty like swimming in space

    [Header("Mouse Look Settings")]
    public float mouseSensitivity = 100f;
    public float smoothLook = 10f;

    [Header("Zoom Settings")]
    public float normalFOV = 60f;
    public float zoomedFOV = 30f;
    public float zoomSpeed = 5f;

    [Header("Swimming Effect")]
    public bool enableBobbing = true;
    public float bobbingAmount = 0.2f;
    public float bobbingSpeed = 3f;

    // Private variables
    private Vector3 velocity = Vector3.zero;
    private float rotationX = 0f;
    private float rotationY = 0f;
    private float bobTimer = 0f;
    private Camera cam;
    private float targetFOV;

    void Start()
    {
        // Lock cursor for better control
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;

        // Get camera component
        cam = GetComponent<Camera>();
        if (cam == null)
            cam = Camera.main;

        // Initialize FOV
        if (cam != null)
        {
            normalFOV = cam.fieldOfView;
            targetFOV = normalFOV;
        }

        // Initialize rotation
        Vector3 rot = transform.localRotation.eulerAngles;
        rotationX = rot.x;
        rotationY = rot.y;
    }


    void HandleMouseLook()
    {
        // Get mouse input
        float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity * Time.deltaTime;
        float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity * Time.deltaTime;

        // Update rotation
        rotationX -= mouseY;
        rotationX = Mathf.Clamp(rotationX, -90f, 90f); // Prevent camera flip
        rotationY += mouseX;

        // Apply smooth rotation
        Quaternion targetRotation = Quaternion.Euler(rotationX, rotationY, 0f);
        transform.localRotation = Quaternion.Slerp(transform.localRotation, targetRotation, smoothLook * Time.deltaTime);
    }

    void HandleMovement()
    {
        // Movement input - SUPPORTS BOTH WASD AND ARROW KEYS!
        float moveX = 0f;
        float moveY = 0f;
        float moveZ = 0f;

        // Forward/Backward - W/S OR Up/Down arrows
        if (Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.UpArrow))
            moveZ = 1f;
        if (Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.DownArrow))
            moveZ = -1f;

        // Left/Right - A/D OR Left/Right arrows
        if (Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.LeftArrow))
            moveX = -1f;
        if (Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.RightArrow))
            moveX = 1f;

        // Up/Down - Space/Ctrl OR PageUp/PageDown
        if (Input.GetKey(KeyCode.Space) || Input.GetKey(KeyCode.PageUp))
            moveY = 1f;
        if (Input.GetKey(KeyCode.LeftControl) || Input.GetKey(KeyCode.RightControl) || Input.GetKey(KeyCode.PageDown))
            moveY = -1f;

        // Calculate movement direction relative to camera
        Vector3 moveDirection = transform.right * moveX + transform.up * moveY + transform.forward * moveZ;
        moveDirection.Normalize();

        // Sprint if holding Shift
        float currentSpeed = Input.GetKey(KeyCode.LeftShift) ? sprintSpeed : swimSpeed;

        // Apply smooth, floaty movement (swimming effect)
        Vector3 targetVelocity = moveDirection * currentSpeed;
        velocity = Vector3.Lerp(velocity, targetVelocity, smoothTime);
        velocity *= inertia; // Creates drifting/floating feeling

        // Move the camera
        transform.position += velocity * Time.deltaTime;
    }

    void HandleZoom()
    {
        if (cam == null) return;

        // Zoom with Right Mouse Button
        if (Input.GetMouseButton(1))
        {
            targetFOV = zoomedFOV;
        }
        else
        {
            targetFOV = normalFOV;
        }

        // Alternative: Zoom with Z key
        if (Input.GetKey(KeyCode.Z))
        {
            targetFOV = zoomedFOV;
        }

        // Smooth zoom transition
        cam.fieldOfView = Mathf.Lerp(cam.fieldOfView, targetFOV, zoomSpeed * Time.deltaTime);
    }

    void HandleBobbing()
    {
        // Creates gentle floating motion when moving
        if (velocity.magnitude > 0.5f)
        {
            bobTimer += Time.deltaTime * bobbingSpeed;
            float bobOffset = Mathf.Sin(bobTimer) * bobbingAmount;

            // Apply subtle bobbing to camera position
            Vector3 newPos = transform.position;
            newPos.y += bobOffset * Time.deltaTime;
            transform.position = newPos;
        }
        else
        {
            bobTimer = 0f;
        }
    }
    void Update()
    {
        // Movement + camera controls
        if (Cursor.lockState == CursorLockMode.Locked)
        {
            HandleMouseLook();
            HandleMovement();
            HandleZoom();

            if (enableBobbing)
                HandleBobbing();
        }

        // Click detection
        if (Input.GetMouseButtonDown(0))
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;

            if (Physics.Raycast(ray, out hit))
            {
                SpaceObject obj = hit.collider.GetComponent<SpaceObject>();
                if (obj != null)
                {
                    obj.ToggleInteraction();
                }
            }
        }
    }


}