import re
from datetime import datetime
from django.shortcuts import render,redirect
from rest_framework import generics,permissions,viewsets
from . import models
from . import serializers
import json
from django.http import QueryDict
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User
from django.contrib import messages
from rest_framework.views import APIView
from django.views import View

from django.db.models import Sum,Count
from rest_framework.decorators import api_view
from django.core.validators import EmailValidator, RegexValidator
from .models import TBL_Cart_Details, TBL_Customer_Details, TBL_Product,TBL_Employee_Details,TBL_Category_Details,TBL_MasterOrder_Details ,TBL_Payment,TBL_Order_Details
from .serializers import CustomerSerializer,EmployeeSerializer,BookTypeSerializer,ProductSerializer,MasterOrderSerializer,OrderSerializer
from django.db.models import Q
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from django.shortcuts import get_object_or_404

import csv

# Create your views here.
# Customer
class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CustomerSerializer
    queryset = models.TBL_Customer_Details.objects.all()



# Employee
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = models.TBL_Employee_Details.objects.all()
    serializer_class = serializers.EmployeeSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Update the instance with the incoming data
        serializer = self.get_serializer(instance, data=request.data, partial=True)  # Use partial=True for PATCH
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)
    
    def get_queryset(self):
        is_active = self.request.GET.get('is_active')
        qs = TBL_Employee_Details.objects.all()
        if is_active is not None:
            qs = qs.filter(IsActive=is_active)
        return qs

    # def update(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     instance.IsActive = '0'  # Set to inactive
    #     instance.save()
    #     return Response({'status': 'employee deactivated'})

# class EmployeeDetail(generics.RetrieveUpdateDestroyAPIView):
#     queryset = models.TBL_Employee_Details.objects.all()
#     serializer_class = serializers.EmployeeDetailSerializer

# Category
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = models.TBL_Category_Details.objects.all()
    serializer_class = serializers.CategorySerializer


class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.TBL_Category_Details.objects.all()
    serializer_class = serializers.CategoryDetailSerializer

# class CategoryDetail(viewsets.ModelViewSet):
#     queryset = models.TBL_Category_Details.objects.all()
#     serializer_class = serializers.CategoryDetailSerializer

# BookType
class BookTypeViewSet(viewsets.ModelViewSet):
    queryset = models.TBL_BookType.objects.all()
    serializer_class = serializers.BookTypeSerializer

# class BookTypeDetail(generics.RetrieveUpdateDestroyAPIView):
#     queryset = models.TBL_BookType.objects.all()
#     serializer_class = serializers.BookTypeDetailSerializer

# Product
class ProductViewSet(viewsets.ModelViewSet):
    queryset = models.TBL_Product.objects.all()
    serializer_class = serializers.ProductSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        Category_ID = self.request.GET.get('category')
        if Category_ID:
            # Use direct filtering if possible
            qs = qs.filter(Category_ID=Category_ID)
        return qs


class ProductDetailViewSet(viewsets.ModelViewSet):
    queryset = models.TBL_Product.objects.all()
    serializer_class = serializers.ProductDetailSerializer    

class CartViewSet(viewsets.ModelViewSet):
    queryset = models.TBL_Cart_Details.objects.all()
    serializer_class = serializers.CartSerializer

class MasterOrderViewSet(viewsets.ModelViewSet):
    queryset = models.TBL_MasterOrder_Details.objects.all()
    serializer_class = serializers.MasterOrderSerializer

    def create(self, request, *args, **kwargs):
        # Convert QueryDict to a regular dictionary if necessary
        data = request.data.dict() if isinstance(request.data, QueryDict) else request.data

        # Validate Employee ID
        emp_id = data.get('Emp_ID')
        if not models.TBL_Employee_Details.objects.filter(Emp_ID=emp_id).exists():
            return Response({'Emp_ID': 'Invalid employee ID.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate Customer ID
        cust_id = data.get('Cust_ID')
        if not models.TBL_Customer_Details.objects.filter(Cust_ID=cust_id).exists():
            return Response({'Cust_ID': 'Invalid customer ID.'}, status=status.HTTP_400_BAD_REQUEST)

        # Proceed with serializer validation and creation
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class OrderViewSet(viewsets.ModelViewSet):
    queryset = models.TBL_Order_Details.objects.all()
    serializer_class = serializers.OrderSerializer

    def create(self, request, *args, **kwargs):
        print("Incoming Order Data:", request.data)  # Log incoming data
        required_fields = ['MasterOrder_ID', 'Product_ID', 'Product_Quantity', 'Product_Price', 'T_amount']
        for field in required_fields:
            if field not in request.data:
                return Response({"error": f"Missing field: {field}"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Validation errors:", serializer.errors)  # Log validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

## Customer Order Items
class CustomerOrderItemList(generics.ListAPIView):
    serializer_class = serializers.OrderWithProductSerializer  # Use the new serializer
    
    def get_queryset(self):
        customer_id = self.kwargs['customer_id']
        # Fetch order details for the specified customer
        return models.TBL_Order_Details.objects.filter(MasterOrder_ID__Cust_ID=customer_id).select_related('Product_ID')
    
# class CustomerOrderItemList(generics.ListAPIView):
#     serializer_class = serializers.OrderSerializer
    
#     def get_queryset(self):
#         customer_id = self.kwargs['customer_id']
#         return models.TBL_MasterOrder_Details.objects.filter(Cust_ID=customer_id).prefetch_related('order_details')
    
# class CustomerOrderItemList(generics.ListAPIView):
#     serializer_class = serializers.OrderSerializer
    
#     def get_queryset(self):
#         customer_id = self.kwargs['customer_id']
#         return models.TBL_MasterOrder_Details.objects.filter(Cust_ID=customer_id)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = models.TBL_Payment.objects.all()
    serializer_class =serializers.PaymentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = models.TBL_Feedback_Details.objects.all()
    serializer_class = serializers.FeedbackSerializer


import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            logger.info(f"Request Body: {request.body}")

            # Ensure the body is not empty
            if not request.body or request.body == b'':
                return JsonResponse({'error': 'Empty request body'}, status=400)

            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse({'error': 'Email and password required'}, status=400)

            customer = TBL_Customer_Details.objects.filter(Email=email).first()

            if customer and customer.Password == password:  # Compare plain password (you should hash passwords)
                return JsonResponse({'bool': True, 'user': customer.Fname,'user_id': customer.Cust_ID})
            else:
                return JsonResponse({'bool': False, 'msg': 'Invalid email or password.'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def customer_register(request):
    if request.method == 'POST':
        fname = request.POST.get('fname')
        lname = request.POST.get('lname')
        email = request.POST.get('email')
        number = request.POST.get('number')
        pwd = request.POST.get('pwd')
        pwd_confirm = request.POST.get('pwd_confirm')
        gen = request.POST.get('gen')
        date_str = request.POST.get('date')

        try:
            date_of_birth = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return JsonResponse({'bool': False, 'msg': 'Invalid date format.'})

        if pwd != pwd_confirm:
            return JsonResponse({'bool': False, 'msg': 'Passwords do not match.'})

        if TBL_Customer_Details.objects.filter(Email=email).exists():
            return JsonResponse({'bool': False, 'msg': 'Email already exists!'})
        
        if TBL_Customer_Details.objects.filter(Phone_Number=number).exists():
            return JsonResponse({'bool': False, 'msg': 'Phone number already exists!'})

        try:
            customer = TBL_Customer_Details.objects.create(
                Fname=fname,
                Lname=lname,
                Gender=gen,
                DOB=date_of_birth,
                Email=email,
                Password=pwd,  # You should hash this in a real-world app
                Phone_Number=number,
            )
            return JsonResponse({'bool': True, 'user': customer.Cust_ID, 'msg': 'Registration successful. You can now login.'})
        except Exception as e:
            return JsonResponse({'bool': False, 'msg': f'Oops... Something went wrong. {str(e)}'})

    return JsonResponse({'bool': False, 'msg': 'Please use POST method to register.'})

@api_view(['POST'])
def orders(request):
    print("Incoming Data:", request.data)  # Debugging output

    if not request.data:
        return Response({"error": "No data received"}, status=status.HTTP_400_BAD_REQUEST)

    required_fields = ['Cust_ID', 'Emp_ID', 'Order_Status']
    for field in required_fields:
        if field not in request.data:
            return Response({"error": f"Missing field: {field}"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"message": "Order created successfully"}, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT'])  # Allow both GET and PUT
def get_customer_details(request, customer_id):
    try:
        customer = TBL_Customer_Details.objects.get(Cust_ID=customer_id)
        
        if request.method == 'GET':
            serializer = CustomerSerializer(customer)
            return Response(serializer.data)
        
        elif request.method == 'PUT':
            serializer = CustomerSerializer(customer, data=request.data, partial=True)  # Allows partial updates
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except TBL_Customer_Details.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        return Response({'error': f"Internal Server Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def get_employees(request):
    employees = TBL_Employee_Details.objects.all()
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)


@csrf_exempt  # Disable CSRF for this view
def update_employee(request, emp_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print(f"Received update request for Employee ID: {emp_id}, Data: {data}")  # Debugging

            employee = get_object_or_404(TBL_Employee_Details, Emp_ID=emp_id)
            
            # Update fields dynamically, converting date strings when necessary
            for field, value in data.items():
                print(f"Updating {field} to {value}")  # Debugging
                if field == "DOB" and isinstance(value, str):
                    # Convert the string to a datetime.date object
                    value = datetime.strptime(value, "%Y-%m-%d").date()
                setattr(employee, field, value)

            employee.save()
            print("Employee updated successfully!")  # Debugging

            return JsonResponse({"message": "Employee updated successfully"}, status=200)

        except Exception as e:
            print(f"Error updating employee: {e}")  # Debugging
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)



def get_categories(request):
    categories = models.TBL_Category_Details.objects.all().values()
    return JsonResponse(list(categories), safe=False)


class BookTypeList(APIView):
    def get(self, request):
        book_types = models.TBL_BookType.objects.all()  # Assuming the model is TBL_BookType
        serializer = BookTypeSerializer(book_types, many=True)
        return Response({"data": serializer.data})


@api_view(['GET'])
def get_products(request):
    products = TBL_Product.objects.select_related(
        'Category_ID', 'Emp_ID', 'Book_ID'
    ).all()

    # Serialize the data with related fields
    serializer = ProductSerializer(products, many=True)
    return Response({'data': serializer.data})


# View to get orders
def get_orders(request):
    if request.method == 'GET':
        orders = models.TBL_MasterOrder_Details.objects.all()
        orders_data = []
        
        for order in orders:
            orders_data.append({
                'MasterOrder_ID': order.MasterOrder_ID,
                'Cust_ID': order.Cust_ID.Cust_ID,  # Assuming Cust_ID has 'Cust_ID' field
                'Emp_ID': order.Emp_ID.Emp_ID,  # Assuming Emp_ID has 'Emp_ID' field
                'Order_DateTime': order.Order_DateTime,
                'T_Quantity': order.T_Quantity,
                'T_Amount': order.T_Amount,
                'Order_Status': order.Order_Status,
            })

        return JsonResponse({'orders': orders_data})
    return JsonResponse({'error': 'Invalid request'}, status=400)

# def customer_list(request):
#     customers = TBL_Customer_Details.objects.all()
#     return render(request, 'customer_list.html', {'customers': customers})

def customer_list(request):
    try:
        customers = TBL_Customer_Details.objects.all().values()
        return JsonResponse({"data": list(customers)}, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@api_view(['GET'])
def get_customers(request):
    customers = TBL_Customer_Details.objects.all()
    serializer = CustomerSerializer(customers, many=True)
    return Response({"data": serializer.data})

@api_view(['GET'])
def get_feedbacks(request):
    feedbacks = TBL_Feedback_Details.objects.select_related('Product_ID', 'Cust_ID').all()
    serializer = FeedbackSerializer(feedbacks, many=True)
    return Response(serializer.data)

def feedback_list(request):
    try:
        # Fetch all feedback from the TBL_Feedback_Details table
        feedbacks = models.TBL_Feedback_Details.objects.all().values(
            'Feedback_ID', 'Product_ID', 'Cust_ID', 'Description', 'IsActive', 'Feedback_DateTime'
        )
        # Return feedbacks as JSON
        return JsonResponse({"data": list(feedbacks)}, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def get_dashboard_counts(request):
    data = {
        "total_customers": TBL_Customer_Details.objects.count(),
        "total_products": TBL_Product.objects.count(),
        "total_categories": TBL_Category_Details.objects.count(),
        "total_orders": TBL_MasterOrder_Details.objects.count(),
        "total_sales": TBL_MasterOrder_Details.objects.aggregate(total_sales=Sum("T_Amount"))["total_sales"] or 0
    }
    return JsonResponse(data)



@api_view(['GET'])
def customer_reports(request):
    report_type = request.GET.get('report_type')

    if report_type == 'all_customers':
        customers = TBL_Customer_Details.objects.annotate(
            total_orders=Count('tbl_masterorder_details'),
            total_amount=Sum('tbl_masterorder_details__T_Amount')
        ).values(
            'Cust_ID', 'Fname', 'Lname', 'Gender', 'Email', 'Phone_Number',
            'City', 'State', 'Country', 'Pincode', 'total_orders', 'total_amount'
        )
        return Response(customers)

    elif report_type == 'customer_by_id':
        customer_id = request.GET.get('customer_id')
        try:
            customer = TBL_Customer_Details.objects.filter(Cust_ID=customer_id).annotate(
                total_orders=Count('tbl_masterorder_details'),
                total_amount=Sum('tbl_masterorder_details__T_Amount')
            ).values(
                'Cust_ID', 'Fname', 'Lname', 'Gender', 'Email', 'Phone_Number',
                'City', 'State', 'Country', 'Pincode', 'total_orders', 'total_amount'
            ).first()
            if not customer:
                return Response({'error': 'Customer not found'}, status=404)
            return Response(customer)
        except TBL_Customer_Details.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=404)

    elif report_type == 'highest_total_amount':
        customers = TBL_Customer_Details.objects.annotate(
            total_amount=Sum('tbl_masterorder_details__T_Amount')
        ).order_by('-total_amount')[:10].values(
            'Cust_ID', 'Fname', 'Lname', 'total_amount'
        )
        return Response(customers)

    elif report_type == 'most_frequent_orders':
        customers = TBL_Customer_Details.objects.annotate(
            total_orders=Count('tbl_masterorder_details')
        ).order_by('-total_orders')[:10].values(
            'Cust_ID', 'Fname', 'Lname', 'total_orders'
        )
        return Response(customers)

    elif report_type == 'orders_by_date':
        date_str = request.GET.get('date')
        if not date_str:
            return Response({'error': 'Date parameter is required'}, status=400)

        try:
            # Ensure the date is in the correct format
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({'error': 'Invalid date format, must be YYYY-MM-DD'}, status=400)

        orders = TBL_MasterOrder_Details.objects.filter(
            Order_DateTime=date_obj
        ).values(
            'MasterOrder_ID', 'Cust_ID', 'T_Quantity', 'T_Amount', 'Order_Status', 'Order_DateTime'
        )

        if not orders.exists():
            return Response({'error': 'No orders found for the given date'}, status=404)

        return Response(list(orders))
        
    return Response({'error': 'Invalid report type'}, status=400)


# def generate_customer_report(request, report_type):
#     customers = TBL_Customer_Details.objects.all()
    
#     if report_type == 'pdf':
#         response = HttpResponse(content_type='application/pdf')
#         response['Content-Disposition'] = 'attachment; filename="customers_report.pdf"'
#         p = canvas.Canvas(response)
#         p.drawString(100, 800, "Customer Report")
#         y = 780
#         for customer in customers:
#             p.drawString(100, y, f"{customer.Cust_ID}: {customer.Fname} {customer.Lname}, {customer.Email}, {customer.Phone_Number}")
#             y -= 20
#         p.showPage()
#         p.save()
#         return response
    
#     elif report_type == 'csv':
#         response = HttpResponse(content_type='text/csv')
#         response['Content-Disposition'] = 'attachment; filename="customers_report.csv"'
#         writer = csv.writer(response)
#         writer.writerow(['Cust_ID', 'Fname', 'Lname', 'Email', 'Phone Number'])
#         for customer in customers:
#             writer.writerow([customer.Cust_ID, customer.Fname, customer.Lname, customer.Email, customer.Phone_Number])
#         return response

# def generate_order_report(request, report_type):
#     orders = TBL_MasterOrder_Details.objects.all()
    
#     if report_type == 'pdf':
#         response = HttpResponse(content_type='application/pdf')
#         response['Content-Disposition'] = 'attachment; filename="orders_report.pdf"'
#         p = canvas.Canvas(response)
#         p.drawString(100, 800, "Orders Report")
#         y = 780
#         for order in orders:
#             p.drawString(100, y, f"{order.MasterOrder_ID}: Customer {order.Cust_ID}, Status: {order.Order_Status}, Amount: {order.T_Amount}")
#             y -= 20
#         p.showPage()
#         p.save()
#         return response
    
#     elif report_type == 'csv':
#         response = HttpResponse(content_type='text/csv')
#         response['Content-Disposition'] = 'attachment; filename="orders_report.csv"'
#         writer = csv.writer(response)
#         writer.writerow(['MasterOrder_ID', 'Customer_ID', 'Order_Status', 'Total_Amount'])
#         for order in orders:
#             writer.writerow([order.MasterOrder_ID, order.Cust_ID.Cust_ID, order.Order_Status, order.T_Amount])
#         return response

# def generate_payment_report(request, report_type):
#     payments = TBL_Payment.objects.all()
    
#     if report_type == 'pdf':
#         response = HttpResponse(content_type='application/pdf')
#         response['Content-Disposition'] = 'attachment; filename="payments_report.pdf"'
#         p = canvas.Canvas(response)
#         p.drawString(100, 800, "Payments Report")
#         y = 780
#         for payment in payments:
#             p.drawString(100, y, f"Transaction {payment.Transaction_ID}: Order {payment.MasterOrder_ID}, Status: {payment.Payment_Status}, Date: {payment.Payment_Date}")
#             y -= 20
#         p.showPage()
#         p.save()
#         return response
    
#     elif report_type == 'csv':
#         response = HttpResponse(content_type='text/csv')
#         response['Content-Disposition'] = 'attachment; filename="payments_report.csv"'
#         writer = csv.writer(response)
#         writer.writerow(['Transaction_ID', 'MasterOrder_ID', 'Payment_Status', 'Payment_Date'])
#         for payment in payments:
#             writer.writerow([payment.Transaction_ID, payment.MasterOrder_ID.MasterOrder_ID, payment.Payment_Status, payment.Payment_Date])
#         return response

# # def get_report_data(request, report_type):
# #     if report_type == "customer":
# #         customers = TBL_Customer_Details.objects.values(
# #             'Cust_ID', 'Fname', 'Lname', 'Gender', 'DOB', 'Email', 'Password', 'Phone_Number', 'Building', 'Street', 'City', 'State', 'Country', 'Pincode', 'IsActive'
# #         )  # Adjust field names to match your model
    
# #         return JsonResponse(list(customers), safe=False)
    
# #     return JsonResponse({"error": "Invalid report type"}, status=400)

# def get_report_data(request, report_type):
#     if report_type == "customer":
#         customers = TBL_Customer_Details.objects.values(
#             'Cust_ID', 'Fname', 'Lname', 'Gender', 'DOB', 'Email', 
#             'Password', 'Phone_Number', 'Building', 'Street', 'City', 
#             'State', 'Country', 'Pincode', 'IsActive'
#         )
#         return JsonResponse(list(customers), safe=False)

#     elif report_type == "order":
#         orders = models.TBL_Order_Details.objects.select_related(
#             'MasterOrder_ID', 'Prod_ID', 'MasterOrder_ID__Cust_ID'
#         ).values(
#             'Order_ID',
#             'MasterOrder_ID',
#             'MasterOrder_ID__Cust_ID',
#             'MasterOrder_ID__Cust_ID__Fname',
#             'MasterOrder_ID__Cust_ID__Lname',
#             'Product_ID',
#             'Product_ID__Product_Name',
#             'Product_ID__Category_ID',
#             'Product_ID__Category_ID__Category_Name',
#             'Product_Price',
#             'Product_Quantity',
#             'T_amount'
#         )
#         return JsonResponse(list(orders), safe=False)
    
#     elif report_type == "payment":
#         payments = models.TBL_Payment.objects.select_related(
#             'MasterOrder_ID', 'MasterOrder_ID__Cust_ID'
#         ).prefetch_related(
#             'MasterOrder_ID__order_details'  # Correct related name
#         ).values(
#             'MasterOrder_ID',  # Master Order ID
#             'MasterOrder_ID__Cust_ID',  # Customer ID
#             'MasterOrder_ID__Cust_ID__Fname',  # Customer First Name
#             'MasterOrder_ID__Cust_ID__Lname',  # Customer Last Name
#             'MasterOrder_ID__order_details__Order_ID',  # Order ID
#             'MasterOrder_ID__order_details__Product_ID',  # Product ID
#             'MasterOrder_ID__order_details__Product_ID__Product_Name',  # Product Name
#             'MasterOrder_ID__order_details__Product_ID__Category_ID',  # Category ID
#             'MasterOrder_ID__order_details__Product_ID__Category_ID__Category_Name',  # Category Name
#             # 'Amount_Paid',  # Amount Paid
#             'Payment_Status',  # Payment Status (Completed/Pending)
#             'Payment_Mode',  # Payment Method (Credit Card, PayPal, etc.)
#             'Transaction_ID',  # Unique Transaction ID
#             'Payment_Date'  # Date of Payment
#         ).distinct()

#         return JsonResponse(list(payments), safe=False)

    
#     return JsonResponse({"error": "Invalid report type"}, status=400)


@csrf_exempt  # Disable CSRF for this view
@api_view(['POST'])
def create_order(request):
    data = request.data

    # Validate Employee ID
    emp_id = data.get('Emp_ID')
    if not TBL_Employee_Details.objects.filter(Emp_ID=emp_id).exists():
        return Response({'Emp_ID': 'Invalid employee ID.'}, status=status.HTTP_400_BAD_REQUEST)

    # Validate Customer ID
    cust_id = data.get('Cust_ID')
    if not TBL_Customer_Details.objects.filter(Cust_ID=cust_id).exists():
        return Response({'Cust_ID': 'Invalid customer ID.'}, status=status.HTTP_400_BAD_REQUEST)

    # Create the master order
    master_order_serializer = MasterOrderSerializer(data=data)
    if master_order_serializer.is_valid():
        master_order = master_order_serializer.save()

        # Create order items
        order_items_data = data.get('order_items', [])
        for item in order_items_data:
            # Ensure the Product_ID is valid
            product_instance = get_object_or_404(TBL_Product, Product_ID=item['Product_ID'])  # Use the correct field name
            order_item = TBL_Order_Details(
                MasterOrder_ID=master_order,
                Product_ID=product_instance,  # Assign the product instance
                Product_Quantity=item['Product_Quantity'],
                Product_Price=item['Product_Price'],
                T_amount=item['T_amount']
            )
            order_item.save()  # Save each order item

        return Response(master_order_serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(master_order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


@csrf_exempt  # Disable CSRF for this view
@api_view(['POST'])
def order_reports(request):
    data = request.data
    filters = Q()  # Initialize an empty Q object for filtering

    # Filter by date range
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    if start_date and end_date:
        filters &= Q(Order_DateTime__range=[start_date, end_date])

    # Filter by order status
    order_status = data.get('order_status')
    if order_status:
        filters &= Q(Order_Status=order_status)

    # Filter by price range
    price_range = data.get('price_range')
    if price_range:
        if price_range == "0-500":
            filters &= Q(T_Amount__gte=0, T_Amount__lte=500)
        elif price_range == "500-1000":
            filters &= Q(T_Amount__gt=500, T_Amount__lte=1000)
        elif price_range == "1000-2000":
            filters &= Q(T_Amount__gt=1000, T_Amount__lte=2000)
        elif price_range == "more_than_2000":
            filters &= Q(T_Amount__gt=2000)

    # Fetch filtered orders
    orders = TBL_MasterOrder_Details.objects.filter(filters).select_related('Cust_ID').values(
        'MasterOrder_ID', 
        'Cust_ID', 
        'T_Quantity', 
        'T_Amount', 
        'Order_Status', 
        'Order_DateTime',
        'Cust_ID__Fname',  # Correctly accessing Fname
        'Cust_ID__Lname'   # Correctly accessing Lname
    )

    return Response(list(orders), status=status.HTTP_200_OK)


@api_view(['POST'])
def product_reports(request):
    report_type = request.data.get('report_type')

    if report_type == 'top_selling':
        top_selling_products = TBL_Product.objects.annotate(
            total_sales=Sum('tbl_order_details__Product_Quantity')
        ).order_by('-total_sales')[:10].values(
            'Product_ID', 'Product_Name', 'Product_Price', 'Stock', 'Cover_Photo', 'Category_ID', 'IsActive'
        )
        return Response(list(top_selling_products))

    elif report_type == 'products_by_category':
        categories = TBL_Category_Details.objects.values('Category_ID', 'Category_Name')
        return Response({'categories': list(categories)})

    elif report_type == 'products_in_category':
        category_id = request.data.get('category_id')
        if category_id == "all" or category_id is None:
            products = TBL_Product.objects.select_related('Category_ID').values(
                'Product_ID', 'Product_Name', 'Product_Price', 'Stock', 'Cover_Photo', 'IsActive',
                'Category_ID', 'Category_ID__Category_Name'
            )
        else:
            products = TBL_Product.objects.filter(Category_ID=category_id).select_related('Category_ID').values(
                'Product_ID', 'Product_Name', 'Product_Price', 'Stock', 'Cover_Photo', 'IsActive',
                'Category_ID', 'Category_ID__Category_Name'
            )
        return Response(list(products))


    elif report_type == 'low_stock':
        low_stock_products = TBL_Product.objects.filter(Stock__lt=10).values(
            'Product_ID', 'Product_Name', 'Product_Price', 'Stock', 'Cover_Photo', 'Category_ID', 'IsActive'
        )
        return Response(list(low_stock_products))


    return Response({'error': 'Invalid report type'}, status=400)

@api_view(['GET'])
def revenue_by_product_category(request):
    # Aggregate total revenue by category
    revenue_data = TBL_Product.objects.values(
        'Category_ID__Category_Name'
    ).annotate(
        total_revenue=Sum('tbl_order_details__T_amount')
    ).order_by('-total_revenue')

    # Prepare the response data
    report = []
    for item in revenue_data:
        report.append({
            'Category_Name': item['Category_ID__Category_Name'],
            'Total_Revenue': item['total_revenue'] or 0,  # Default to 0 if None
        })

    return Response(report)


def revenue_report(request):
    report_type = request.GET.get('type')  # 'product' or 'category'
    print(f"Report type requested: {report_type}")  # Debugging line
    
    if report_type == 'product':
        revenue_data = (
            TBL_Order_Details.objects
            .values('Product_ID__Product_Name')
            .annotate(total_revenue=Sum('T_amount'))
        )
    elif report_type == 'category':
        revenue_data = (
            TBL_Order_Details.objects
            .values('Product_ID__Category_ID__Category_Name')
            .annotate(total_revenue=Sum('T_amount'))
        )
    else:
        return JsonResponse({'error': 'Invalid report type'}, status=400)

    print(f"Revenue data: {list(revenue_data)}")  # Debugging line
    return JsonResponse(list(revenue_data), safe=False)