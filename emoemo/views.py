from django.shortcuts import render

from .main import main

def index(request):
    font_text = request.GET.get("font-text")

    if font_text:
        main(font_text, auto_font_size=True)

    return render(request, "base.html", {"font_text": font_text})
