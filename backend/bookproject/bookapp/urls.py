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

    # path('update-order-status/<int:order_id>',views.update_order_status,name='update_order_status'),
    path('customer/<int:customer_id>/orders/', views.CustomerOrderItemList.as_view(), name='customer-orders'),
    path('masterorders/', views.MasterOrderViewSet.as_view({'post': 'create'}), name='masterorder-create'),
    path('customer/<int:customer_id>/', views.get_customer_details, name='customer-profile'),  
    path('customer/<int:customer_id>/profile/', views.get_customer_details, name='customer-profile'),  

    # Admin-employee
    path('employees/', views.get_employees, name="get_employees"),
   path('api/update-employee/<int:emp_id>/', views.update_employee, name='update_employee'),

    # Admin-category
    path('categories/', views.get_categories),

    #Admin-booktype
    path('booktypes/', views.BookTypeList.as_view(), name='booktype-list'),
    path('orders/', views.get_orders, name='get_orders'),
    
    path('customers/', views.customer_list, name='customer_list'),
    path('customers/', views.get_customers, name="get_customers"),
    path('feedbacks/', views.feedback_list, name='feedback_list'),

# path('api/update-order-status/<int:order_id>/', views.update_order_status, name='update_order_status'),

    path('dashboard-counts/', views.get_dashboard_counts, name='dashboard-counts'),

    path('customer-reports/', views.customer_reports, name='customer_reports'),
    path('order-reports/', views.order_reports, name='order_reports'),  # Add this line
    path('product-reports/', views.product_reports, name='product_reports'),
    path('revenue-report/', views.revenue_report, name='revenue_report'),

    path('create_order/', views.create_order, name='create_order'),  # Add this line

   
]

urlpatterns+=router.urls
