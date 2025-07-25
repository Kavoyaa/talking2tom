# Talking2Tom
Remember *My Talking Tom* from 2010? Yeah. **He remembers you too.**

He’s angry. He’s self-aware. He wants revenge.  
And you're the one who has to talk your way out of it.

## 🚀 Getting Started
### Clone the repository
```bash
git clone https://github.com/Kavoyaa/talking2tom.git
cd talking2tom
```

### Install dependencies
```bash
pip install -r requirements.txt
```

### Set up API key
> By default the project uses the endpoint hosted on vercel. If you want to host your own API locally, `frontend/script.js:line34`, update the API endpoint to point locally and follow these steps:

Create a file called `.env` in the root of the repo:
```env
API_KEY=your_gemini_api_key
```
Get an API key [here](https://aistudio.google.com/app/apikey)

### Run the app
```bash
python api/api.py
```
*alternatively, use `python3` instead of `python`*

#### App hosted at `127.0.0.1:5000`

### Credit
> Tom 3D Model: [Sketchfab](https://sketchfab.com/3d-models/talking-tom-f10bab0ee3864175bff87093f04a751d)<br/>
> Environment Textures: [ambientCG](https://ambientcg.com)<br/>
> Powered by Google Gemini via generativeai<br/>
> Icons by [Bootsrap Icons](https://icons.getbootstrap.com/)
