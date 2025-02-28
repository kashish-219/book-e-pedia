
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

from rest_framework.decorators import api_view
from django.core.validators import EmailValidator, RegexValidator
from .models import TBL_Cart_Details, TBL_Customer_Details, TBL_Product  # Import your customer model


# Create your views here.
# Customer
class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CustomerSerializer
    queryset = models.TBL_Customer_Details.objects.all()

# class CustomerList(generics.ListCreateAPIView):
#     queryset = models.TBL_Customer_Details.objects.all()
#     serializer_class = serializers.CustomerSerializer
#
# class CustomerDetail(generics.RetrieveUpdateDestroyAPIView):
#     queryset = models.TBL_Customer_Details.objects.all()
#     serializer_class = serializers.CustomerDetailSerializer

# Employee
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = models.TBL_Employee_Details.objects.all()
    serializer_class = serializers.EmployeeSerializer

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

# class MasterOrderViewSet(viewsets.ModelViewSet):
#     queryset = models.TBL_MasterOrder_Details.objects.all()
#     serializer_class = serializers.MasterOrderSerializer

#     def create(self, request, *args, **kwargs):
#         # Convert QueryDict to a regular dictionary if necessary
#         data = request.data.dict() if isinstance(request.data, QueryDict) else request.data

#         # Validate Employee ID
#         emp_id = data.get('Emp_ID')
#         if not models.TBL_Employee_Details.objects.filter(Emp_ID=emp_id).exists():
#             return Response({'Emp_ID': 'Invalid employee ID.'}, status=status.HTTP_400_BAD_REQUEST)

#         # Validate Customer ID
#         cust_id = data.get('Cust_ID')
#         if not models.TBL_Customer_Details.objects.filter(Cust_ID=cust_id).exists():
#             return Response({'Cust_ID': 'Invalid customer ID.'}, status=status.HTTP_400_BAD_REQUEST)

#         # Proceed with serializer validation and creation
#         serializer = self.get_serializer(data=data)
#         if serializer.is_valid():
#             self.perform_create(serializer)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class MasterOrderViewSet(viewsets.ModelViewSet):
#     queryset = models.TBL_MasterOrder_Details.objects.all()
#     serializer_class = serializers.MasterOrderSerializer

#     def create(self, request, *args, **kwargs):
#         print("Incoming request data:", request.data)  # Log incoming data
#         serializer = self.get_serializer(data=request.data)

#         # Validate Employee ID
#         emp_id = request.data.get('Emp_ID')
#         if not models.TBL_Employee_Details.objects.filter(Emp_ID=emp_id).exists():
#             return Response({'Emp_ID': 'Invalid employee ID.'}, status=status.HTTP_400_BAD_REQUEST)

#         # Validate Customer ID
#         cust_id = request.data.get('Cust_ID')
#         if not TBL_Customer_Details.objects.filter(Cust_ID=cust_id).exists():
#             return Response({'Cust_ID': 'Invalid customer ID.'}, status=status.HTTP_400_BAD_REQUEST)

#         if serializer.is_valid():
#             self.perform_create(serializer)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             print("Validation errors:", serializer.errors)  # Log validation errors
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
# class OrderViewSet(viewsets.ModelViewSet):
#     queryset = models.TBL_Order_Details.objects.all()
#     serializer_class = serializers.OrderSerializer
# class OrderViewSet(viewsets.ModelViewSet):
#     queryset = models.TBL_Order_Details.objects.all()
#     serializer_class = serializers.OrderSerializer

#     def create(self, request, *args, **kwargs):
#         # Validate incoming data
#         required_fields = ['MasterOrder_ID', 'Product_ID', 'Product_Quantity', 'Product_Price']
#         for field in required_fields:
#             if field not in request.data:
#                 return Response({"error": f"Missing field: {field}"}, status=status.HTTP_400_BAD_REQUEST)

#         # Proceed with serializer validation and creation
#         serializer = self.get_serializer(data=request.data)
#         if serializer.is_valid():
#             self.perform_create(serializer)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class OrderViewSet(viewsets.ModelViewSet):
#     queryset = models.TBL_Order_Details.objects.all()
#     serializer_class = serializers.OrderSerializer

#     def create(self, request, *args, **kwargs):
#         print("Incoming Order Data:", request.data)  # Log incoming data
#         # Validate incoming data
#         required_fields = ['MasterOrder_ID', 'Product_ID', 'Product_Quantity', 'Product_Price']
#         for field in required_fields:
#             if field not in request.data:
#                 return Response({"error": f"Missing field: {field}"}, status=status.HTTP_400_BAD_REQUEST)

#         # Proceed with serializer validation and creation
#         serializer = self.get_serializer(data=request.data)
#         if serializer.is_valid():
#             self.perform_create(serializer)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = models.TBL_Payment.objects.all()
    serializer_class = serializers.PaymentSerializer

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
                return JsonResponse({'bool': True, 'user': customer.Fname})
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