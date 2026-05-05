"""
Unity WebGL Build Server Configuration
Properly configures Flask to serve Brotli-compressed Unity WebGL builds
with correct MIME types and response headers.
"""

import os
from pathlib import Path
from flask import Flask, send_file, jsonify

def configure_unity_build_serving(app: Flask):
    """
    Configure Flask to serve Unity WebGL build files with proper headers.
    Call this in your create_app() function.
    
    Usage:
        app = create_app()
        configure_unity_build_serving(app)
    """
    
    # Path to Unity build files
    UNITY_BUILD_PATH = Path(__file__).parent.parent / "frontend" / "public" / "unity-build" / "Build"
    
    MIME_TYPES = {
        ".js": "application/javascript; charset=utf-8",
        ".js.br": "application/javascript; charset=utf-8",
        ".wasm": "application/wasm",
        ".wasm.br": "application/wasm",
        ".data": "application/octet-stream",
        ".data.br": "application/octet-stream",
        ".loader": "application/javascript; charset=utf-8",
    }
    
    def get_mime_type(filename: str) -> str:
        """Get MIME type based on file extension."""
        for ext, mime_type in MIME_TYPES.items():
            if filename.endswith(ext):
                return mime_type
        return "application/octet-stream"
    
    @app.route('/api/unity-build/<path:filename>')
    def serve_unity_build(filename: str):
        """
        Serve Unity build files with proper headers.
        
        Example URLs:
        - /api/unity-build/Build.loader
        - /api/unity-build/Build.data.br
        - /api/unity-build/Build.wasm.br
        - /api/unity-build/Build.framework.js.br
        """
        
        try:
            file_path = UNITY_BUILD_PATH / filename
            
            # Security: prevent directory traversal
            if not file_path.exists() or not file_path.is_file():
                return jsonify({"error": f"File not found: {filename}"}), 404
            
            # Check if path is within UNITY_BUILD_PATH (security)
            try:
                file_path.relative_to(UNITY_BUILD_PATH)
            except ValueError:
                return jsonify({"error": "Invalid path"}), 403
            
            mime_type = get_mime_type(filename)
            
            # Send file with appropriate headers
            response = send_file(
                str(file_path),
                mimetype=mime_type,
                download_name=filename,
                as_attachment=False
            )
            
            # Add required headers for WebGL with SharedArrayBuffer
            response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
            response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
            response.headers["Cross-Origin-Resource-Policy"] = "cross-origin"
            
            # Compression headers
            if filename.endswith(".br"):
                response.headers["Content-Encoding"] = "br"
            
            # Caching headers
            if filename.endswith((".br", ".loader")):
                # Cache long-term for versioned assets
                response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
            else:
                response.headers["Cache-Control"] = "public, max-age=3600"
            
            response.headers["Vary"] = "Accept-Encoding"
            
            return response
        
        except Exception as e:
            app.logger.error(f"Error serving Unity build file {filename}: {e}")
            return jsonify({"error": "Internal server error"}), 500
    
    @app.route('/api/unity-build/status')
    def unity_build_status():
        """
        Check if Unity build files are available.
        Useful for debugging and health checks.
        """
        try:
            files = {
                "loader": (UNITY_BUILD_PATH / "Build.loader").exists(),
                "data": (UNITY_BUILD_PATH / "Build.data.br").exists(),
                "wasm": (UNITY_BUILD_PATH / "Build.wasm.br").exists(),
                "framework": (UNITY_BUILD_PATH / "Build.framework.js.br").exists(),
            }
            
            all_ready = all(files.values())
            
            return jsonify({
                "ready": all_ready,
                "files": files,
                "path": str(UNITY_BUILD_PATH),
            })
        except Exception as e:
            return jsonify({
                "ready": False,
                "error": str(e)
            }), 500


def serve_unity_static_direct(app: Flask):
    """
    Alternative: Serve Unity build directly via static files.
    Less flexible than serve_unity_build but simpler.
    Use if you prefer Flask's built-in static serving.
    
    Add to Flask config:
        app.config['UNITY_BUILD'] = 'path/to/unity/build'
    """
    
    @app.route('/unity-build/<path:filename>')
    def static_unity_build(filename: str):
        build_path = Path(app.config.get('UNITY_BUILD', 'public/unity-build/Build'))
        file_path = build_path / filename
        
        if not file_path.exists():
            return jsonify({"error": "Not found"}), 404
        
        try:
            file_path.relative_to(build_path)
        except ValueError:
            return jsonify({"error": "Forbidden"}), 403
        
        mime_type = {
            ".br.js": "application/javascript",
            ".br": "application/octet-stream",
            ".wasm": "application/wasm",
        }.get(''.join(Path(filename).suffixes), "application/octet-stream")
        
        response = send_file(str(file_path), mimetype=mime_type)
        response.headers["Content-Encoding"] = "br"
        response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
        response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
        
        return response
