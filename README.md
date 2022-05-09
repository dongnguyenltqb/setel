**Backend Engineer Practical Assignment**

#### NOTE

1. there are two services,order service and payment service
2. the order service source code is `setel/order`, the payment service code is `setel/payment`
3. when create an order, order service will send a http request to payment service, it generate `confirm_url` for payment service to confirm this order and `cancel_url` for payment service to decline this order.
4. after amount of time  (we can config about as order enviroment variable `deliver_time`), the backgroud job of order service will update status of order to `delivered` if the current status is `confirmed`. the code for this job is located in `setel/order/src/jobs/deliverOrder.ts`
5. payment service can confirm,decline an order randomly, the current way is inject a function return boolean to PaymentService class, check code as `setel/payment/src/service/payment.ts` line 6, and implement function at `setel/payment/src/server.ts` line 29.

#### Deployment method

1. Deploy two service behind a reverse proxy server like nginx, aws load balancer
2. Forward traffic to each service depend on request localtion path
   - `/api/orders` proxy to Order service.
   - `/api/payments` proxy to Payment Service 
3. Configure environtment for each service, see `Environment` below.

#### Build and Test

1. Order service

   - go to order service

     ```
     cd order
     ```

   - build docker image

     ```
     docker build -t setel-order .
     ```

   - to test order service (make sure env was passed to the process via .env file or another way)

     ```
     yarn install
     yarn test
     ```

   - to run service without using docker

     ```
     yarn install
     yarn build
     yarn start
     ```

     

2. Payment service

   - go to payment service folder

     ```
     cd payment
     ```

   - build docker image

     ```
     docker build -t setel-payment .
     ```

   - to run service without using docker

     ```
     yarn install
     yarn build
     yarn start
     ```

     

#### Environment

1. Order service

   ```
   server_port=1368
   postgres_url=postgres://setel:setel@localhost:5432/setel
   order_host=https://setel.dongnguyen.dev
   payment_host=https://setel.dongnguyen.dev
   deliver_time=10
   ```

   `order_host` and `payment_host` is the host name of reverse proxy server, it can be the same if two service share same proxy server.

   `deliver_time` is amout time that the `confirmed` order will be move to `delivered` state. The unit is seconds. 

2. Payment service

   ```
   server_port=1369
   ```

   

#### API Document

1. Create order

   - send POST request to `/api/orders`, require `name` (order name), `price`(order price)

   ```
   curl --location --request POST 'https://setel.dongnguyen.dev/api/orders' \
   --header 'Content-Type: application/json' \
   --data-raw '{
       "name":"hello",
       "price":10
   }'
   ```

   - response 

   ```
   {
       "status": true,
       "result": {
           "created_at": "2022-05-07T09:40:01.957Z",
           "updated_at": "2022-05-07T09:40:01.957Z",
           "id": 79,
           "name": "hello",
           "price": 10,
           "status": "created"
       }
   }
   ```

2. Get order status

   - send GET request to. `/api/orders/:id`

     ```
     curl --location --request GET 'https://setel.dongnguyen.dev/api/orders/80'
     ```

   - response

     ```
     {
         "status": true,
         "result": {
             "id": 80,
             "name": "hello",
             "price": 10,
             "status": "created",
             "created_at": "2022-05-07T09:41:51.866Z",
             "updated_at": "2022-05-07T09:41:51.866Z"
         }
     }
     ```

3. Cancel an order

   - send POST request to `/api/orders/cancel/:id`

     ```
     curl --location --request POST 'https://setel.dongnguyen.dev/api/orders/cancel/84'
     ```

   - response

     ```
     {
         "status": true,
         "result": {
             "id": 84,
             "name": "hello",
             "price": 10,
             "status": "canceled",
             "created_at": "2022-05-07T09:44:27.477Z",
             "updated_at": "2022-05-07T09:44:31.365Z"
         }
     }
     ```