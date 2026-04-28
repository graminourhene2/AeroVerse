**fesh qaadanaamel bedhabt:**



**\*\*BuilderNew.tsx  hedhi tebaa el builder ( camera)---> Sends it as base64 to your existing /api/cv/diagnose endpoint (Flask, port 5000)**



**\*\*D:\\PCD\\AeroVerse\\frontend\\src\\pages\\SpaceSimulationNew.tsx (hedhi tebaa el simulation )**



**\*\* Open aeroverse\_app.py and paste the content of** cv\_vision\_endpoint.py **just before the if \_\_name\_\_ == '\_\_main\_\_':**





**\*\*(needed to screenshot the canvas):**

*cd D:\\PCD\\AeroVerse\\frontend*

*npm install html2canvas*   **(hedhi taamlek screenshots , GPT-4o returns: name, category, description )**



**Start your Flask backend:**

*cd D:\\PCD\\AeroVerse\\computer-vision\\backend*

*python aeroverse\_app.py*



**Start your frontend:**

*cd D:\\PCD\\AeroVerse\\frontend*

*npm run dev*













* **fel builder part :** 🚀( SpacecraftH70 Rocket, Rocket Engine, Turbofan Engine)

&#x20;                     🛰 Satellites (AcrimSAT, Agena Target Vehicle, Landsat 1-3, 70m Deep                    Space Dish, Bennu Asteroid, AIM Satellite)

&#x20;                     🌍 Planets (Earth, Mars, Jupiter, Saturn, Venus, Mercury, Neptune, Uranus, Eris)

&#x20;                     ✨ Phenomena (The Sun, Black Hole)



###### **\*\*problems to fix :** 

Problem 1 (images): Use picsum.photos + space-themed Unsplash URLs that actually load, plus SVG fallbacks rendered inline — no CORS issues ever.

Problem 2 (CV wrong results): Replace the random heuristic in cv\_diagnostic\_service.py with GPT-4o Vision — same API key, actually looks at the image and identifies what's really there.



**\*\*andi moshkla fel training data ( Training data is tiny — 11 images for rocket\_engine, 24 for rocket — way too few for a CNN**

**The model itself is likely undertrained/overfit)**



**\*\***





