from django.shortcuts import render


def index(request):
    font_text = request.GET.get("font-text")

    return render(request, "base.html", {"font_text": font_text})
