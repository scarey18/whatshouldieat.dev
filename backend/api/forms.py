from django.forms import ModelForm

from .models import FeedbackPost


class FeedbackPostForm(ModelForm):
	class Meta:
		model = FeedbackPost
		fields = '__all__'