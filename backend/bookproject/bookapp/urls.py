from django.urls import path
from . import views
from rest_framework import routers

router = routers.DefaultRouter()

# router = routers.SimpleRouter()
router.register('customers',views.CustomerViewSet)
router.register('employees',views.EmployeeViewSet)
router.register('category',views.CategoryViewSet)
# router.register('category/<int:pk>', views.CategoryDetail, basename='category-detail')
router.register('booktypes',views.BookTypeViewSet)
router.register('products',views.ProductViewSet)
router.register('products/<int:pk>', views.ProductDetailViewSet, basename='product-detail')  # Unique basename for the detail view
router.register('cart',views.CartViewSet)
router.register('masterorders',views.MasterOrderViewSet)
router.register('orders',views.OrderViewSet)
router.register('payments',views.PaymentViewSet)
router.register('feedbacks',views.FeedbackViewSet)

urlpatterns = [
    path('category/<int:pk>/', views.CategoryDetail.as_view(), name='category-detail'),  # Define the URL for CategoryDetail

    path('login/', views.login_view, name='customer_login'),
    path('register/',views.customer_register,name='customer_register'),

     path('masterorders/', views.MasterOrderViewSet.as_view({'post': 'create'}), name='masterorder-create'),

]

urlpatterns+=router.urls
