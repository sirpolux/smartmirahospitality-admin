<?php

namespace App\Http\Controllers;

use App\Services\DataService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    //

    public function index(DataService $dataService)
    {
        // Example data — replace with real queries later
        //$allUsers = $dataService->allCustomers();
        $allOrders =  $dataService->orderStatus('all');
        $completedOrders = $dataService->orderStatus('COMPLETED');
        $pendingOrders = $dataService->pendingOrders();
        $allTransactions = $dataService->totalTransaction();
        $pendingTransactions = $dataService->pendingTransaction();
        $completedTransaction = $dataService->completedTransaction();
        $inventoryItems = $dataService->inventoryItemsCount();
        $totalApprovedTransactions = $dataService->totalApprovedTransactions();
        $totalSales = $dataService->totalSales();
        $saleCount = $dataService->salesCount();

        //update to show sales. 
 
        

        return inertia("Dashboard/Home", [
            'allOrders'=>$allOrders,
            'completedOrders'=>$completedOrders,
            'pendingOrders'=>$pendingOrders,
            'allTransactions'=>$allTransactions,
            'pendingTransaction'=>$pendingTransactions,
            'completedTransaction'=>$completedTransaction,
            'inventoryItems'=>$inventoryItems,
            'totalApprovedTransactions'=>$totalApprovedTransactions,
            'totalSales'=>$totalSales,
            'saleCount'=>$saleCount,
        ]);
    }
}
