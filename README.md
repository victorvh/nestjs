## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start
```

## Assumptions

I assumed that the transaction API could also return a type of "paidOut". So payout is transactions that haven't been handled and paidOut is signifying that the transaction is completed.

## Solution

The solution is a simple Nest.JS API with an in memory mongoDB database, using nestjs schedule for querying the mocked Transaction API every minute. Using cron-jobs like this would not be horizontally scalable, so we would need to use another scheduling mechanism (like GCP Cloud scheduler) for fetching from the Transactions API.

## Example request:

http://localhost:3000/aggregated/074092

http://localhost:3000/payouts

## Potential improvements

1. Transaction API Querying: Develop logic to query the transaction API at specific time intervals, and handle retries within those intervals if requests fail or if the API rate limits are exceeded due to a high volume of transactions. This will ensure reliable data fetching and adherence to API rate limits.

2. Data Consistency: The current implementation inserts aggregated data into the database, but if the database encounters issues, data may be lost, causing inconsistencies with the transaction API. Implementing a robust data synchronization and recovery mechanism would ensure data consistency and reliability.

## Testing

    1.	Unit Tests:
    	Service Methods:
    	Write tests for each service method to validate their functionality.
    	Example: For aggregateData, write tests to ensure it correctly aggregates transactions.e
    2.	Integration Tests:
    	Database Operations:
    	Write tests to verify interactions with the MongoDB database, including data retrieval and persistence.
    	Example: Test saveAggregatedData to ensure it correctly updates the database.
    	API Endpoints:
    	Write tests to validate the responses of the API endpoints.
    	Example: Test /users/aggregated/:userId to ensure it returns the correct aggregated data.
    3.	End-to-End Tests:
    	Full Application Flow:
    	Write tests to simulate real-world scenarios.
    	Example: Simulate the fetching of transactions, their aggregation, and the retrieval of aggregated data via the API.
    4.	Performance Tests:
    	Load Testing:
    	Write tests to simulate high load and measure the performance of the application.
    	Example: Test the application’s response time and throughput under high transaction volumes.

Since this is a pretty well defined scenario, achieving a 100% test coverage would be achieveable and most likely also desirable.
