<?php 

namespace App\Services;

use App\Models\Item;
use App\Models\Order;
use App\Models\Sale;
use App\Models\Transaction;
use App\Models\User;

class DataService{

    public function getStats(){
        
    }

    public function orderStatus(string $status){
        if($status == 'all'){
            return Order::count();
        }
        return Order::where('status', $status)->count();
    }

    public function transactionStats(String $status){
        if($status == 'all'){
            return Transaction::count();
        }
        return Transaction::where('status', $status);
    }



    public function pendingOrders(){
        $orderPendinfg = Order::where('status', "confirmed")
        ->orWhere('status', 'pending')
        ->count();
        return $orderPendinfg;
    }

    // public function allCustomers(){
    //     return User::where('user_type', 'customer')->count();
    // }

    public function transactionComputation(){

    }

    public function pendingTransaction()
    {
        return Transaction::whereIn('status', [
                'pending'
            ])
            ->whereIn('purpose', [
                'payment',
            ])
            ->count();
    }
    

    public function totalTransaction(){
        return Transaction::where('purpose', 'payment')->count();
    }

    public function completedTransaction(){
        return Transaction::where('status', 'completed')
        ->count();
    }

    public function confirmedTransaction(){
        //return Transaction::where('status', '')
    }

    public function inventoryItemsCount(){
        return Item::count();
    }

    public function totalApprovedTransactions(){
        return Transaction::where('status', 'completed')
        ->sum('amount');
    }

    public function totalSales(){
        return Sale::sum('total_price');
    }

    public function salesCount(){
        return Sale::count();
    }   

    // public function totalApprovedTransactionsEvent(){
    //     return Transaction::where('transaction_status', 'APPROVED')
    //                         ->where('purpose', 'RETREAT BOOKING')
    //                         ->sum('amount');
    // }

    // public function totalApprovedTransactionsBookStore(){
    //     return Transaction::where('transaction_status', 'APPROVED')
    //     ->orWhere("transaction_status", "PAID")
    //     ->where('purpose', 'BOOK PURCHASE')
    //     ->sum('amount');
    // }



    

    

    
}