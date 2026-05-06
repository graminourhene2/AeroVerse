using UnityEngine;
using System.Runtime.InteropServices;

public class UnityCaptureBridge : MonoBehaviour
{
#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern void SendImageToJS(string base64);
#endif

    public void CaptureAndSend()
    {
        StartCoroutine(Capture());
    }

    private System.Collections.IEnumerator Capture()
    {
        yield return new WaitForEndOfFrame();

        Texture2D tex = new Texture2D(Screen.width, Screen.height, TextureFormat.RGB24, false);
        tex.ReadPixels(new Rect(0, 0, Screen.width, Screen.height), 0, 0);
        tex.Apply();

        byte[] bytes = tex.EncodeToPNG();
        string base64 = System.Convert.ToBase64String(bytes);

#if UNITY_WEBGL && !UNITY_EDITOR
        SendImageToJS(base64);
#endif

        Debug.Log("Image captured and sent to JS");
    }
}