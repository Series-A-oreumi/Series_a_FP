from django import forms

class CustomLoginForm(forms.Form):
    email = forms.CharField(
        widget=forms.EmailInput(attrs={'placeholder': '이메일', 'class': 'login-input'}),
        label='',
        label_suffix='', 
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': '비밀번호', 'class': 'login-input'}),
        label='',
        label_suffix='', 
    )

class CustomRegisterForm(forms.Form):
    email = forms.CharField(
        widget=forms.EmailInput(attrs={'placeholder': '이메일', 'class': 'login-input'}),
        label='',
        label_suffix='', 
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': '비밀번호', 'class': 'login-input'}),
        label='',
        label_suffix='', 
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': '비밀번호 확인', 'class': 'login-input'}),
        label='',
        label_suffix='', 
    )
    username = forms.CharField(
        widget=forms.TextInput(attrs={'placeholder': '이름', 'class': 'login-input'}),
        label='',
        label_suffix='', 
    )
    nickname = forms.CharField(
        widget=forms.TextInput(attrs={'placeholder': '닉네임', 'class': 'login-input'}),
        label='',
        label_suffix='', 
    )

    bootcamp_choices = (
        ('백엔드 1기', '백엔드 오르미 1기'),
        ('백엔드 2기', '백엔드 오르미 2기'),
        ('백엔드 3기', '백엔드 오르미 3기'),
        ('AI 1기', 'AI WASSUP 1기'),
    )

    bootcamp = forms.ChoiceField(
        choices=bootcamp_choices,
        widget=forms.Select(attrs={'class': 'login-input'}),
        label='',
        label_suffix='', 
    )
