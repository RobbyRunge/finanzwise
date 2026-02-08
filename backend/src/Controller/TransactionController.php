<?php

namespace App\Controller;

use App\Entity\Transaction;
use App\Repository\AccountRepository;
use App\Repository\TransactionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/transactions', name: 'api_transactions_')]
class TransactionController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TransactionRepository $transactionRepository,
        private AccountRepository $accountRepository
    ) {
    }

    /**
     * Get all transactions
     * GET /api/transactions
     */
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $transactions = $this->transactionRepository->findAll();

        $data = array_map(function (Transaction $transaction) {
            return $this->formatTransaction($transaction);
        }, $transactions);

        return $this->json($data);
    }

    /**
     * Get single transaction
     * GET /api/transactions/{id}
     */
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $transaction = $this->transactionRepository->find($id);

        if (!$transaction) {
            return $this->json(['error' => 'Transaction not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->formatTransaction($transaction));
    }

    /**
     * Create new transaction
     * POST /api/transactions
     * Body: {
     *   "accountId": 1,
     *   "amount": "100.50",
     *   "type": "income",
     *   "category": "Salary",
     *   "description": "Monthly salary",
     *   "date": "2026-02-06"
     * }
     */
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validation
        if (!isset($data['accountId']) || !isset($data['amount']) || !isset($data['type'])) {
            return $this->json(
                ['error' => 'accountId, amount, and type are required'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // Check if account exists
        $account = $this->accountRepository->find($data['accountId']);
        if (!$account) {
            return $this->json(
                ['error' => 'Account not found'],
                Response::HTTP_NOT_FOUND
            );
        }

        // Validate type
        if (!in_array($data['type'], ['income', 'expense'])) {
            return $this->json(
                ['error' => 'Type must be either "income" or "expense"'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // Validate amount
        if (!is_numeric($data['amount'])) {
            return $this->json(
                ['error' => 'Amount must be a valid number'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // Validate date format if provided
        $date = null;
        if (isset($data['date'])) {
            try {
                $date = new \DateTime($data['date']);
            } catch (\Exception $e) {
                return $this->json(
                    ['error' => 'Invalid date format. Use YYYY-MM-DD'],
                    Response::HTTP_BAD_REQUEST
                );
            }
        }

        // Create transaction
        $transaction = new Transaction();
        $transaction->setAccount($account);
        $transaction->setAmount(number_format((float)$data['amount'], 2, '.', ''));
        $transaction->setType($data['type']);
        $transaction->setCategory($data['category'] ?? null);
        $transaction->setDescription($data['description'] ?? null);

        if ($date) {
            $transaction->setDate($date);
        }

        $this->entityManager->persist($transaction);
        $this->entityManager->flush();

        return $this->json(
            $this->formatTransaction($transaction),
            Response::HTTP_CREATED
        );
    }

    /**
     * Update transaction
     * PUT /api/transactions/{id}
     */
    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $transaction = $this->transactionRepository->find($id);

        if (!$transaction) {
            return $this->json(['error' => 'Transaction not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        // Update amount if provided
        if (isset($data['amount'])) {
            if (!is_numeric($data['amount'])) {
                return $this->json(
                    ['error' => 'Amount must be a valid number'],
                    Response::HTTP_BAD_REQUEST
                );
            }
            $transaction->setAmount(number_format((float)$data['amount'], 2, '.', ''));
        }

        // Update type if provided
        if (isset($data['type'])) {
            if (!in_array($data['type'], ['income', 'expense'])) {
                return $this->json(
                    ['error' => 'Type must be either "income" or "expense"'],
                    Response::HTTP_BAD_REQUEST
                );
            }
            $transaction->setType($data['type']);
        }

        // Update category if provided
        if (isset($data['category'])) {
            $transaction->setCategory($data['category']);
        }

        // Update description if provided
        if (isset($data['description'])) {
            $transaction->setDescription($data['description']);
        }

        // Update date if provided
        if (isset($data['date'])) {
            try {
                $date = new \DateTime($data['date']);
                $transaction->setDate($date);
            } catch (\Exception $e) {
                return $this->json(
                    ['error' => 'Invalid date format. Use YYYY-MM-DD'],
                    Response::HTTP_BAD_REQUEST
                );
            }
        }

        // Update account if provided
        if (isset($data['accountId'])) {
            $account = $this->accountRepository->find($data['accountId']);
            if (!$account) {
                return $this->json(
                    ['error' => 'Account not found'],
                    Response::HTTP_NOT_FOUND
                );
            }
            $transaction->setAccount($account);
        }

        $this->entityManager->flush();

        return $this->json($this->formatTransaction($transaction));
    }

    /**
     * Delete transaction
     * DELETE /api/transactions/{id}
     */
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $transaction = $this->transactionRepository->find($id);

        if (!$transaction) {
            return $this->json(['error' => 'Transaction not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($transaction);
        $this->entityManager->flush();

        return $this->json(['message' => 'Transaction deleted successfully']);
    }

    /**
     * Get all transactions for a specific account
     * GET /api/transactions/account/{accountId}
     */
    #[Route('/account/{accountId}', name: 'account_transactions', methods: ['GET'])]
    public function getAccountTransactions(int $accountId): JsonResponse
    {
        $account = $this->accountRepository->find($accountId);

        if (!$account) {
            return $this->json(['error' => 'Account not found'], Response::HTTP_NOT_FOUND);
        }

        $transactions = $this->transactionRepository->findBy(
            ['account' => $account],
            ['date' => 'DESC']  // Sort by date, newest first
        );

        $data = array_map(function (Transaction $transaction) {
            return $this->formatTransaction($transaction);
        }, $transactions);

        // Calculate totals
        $totalIncome = '0.00';
        $totalExpense = '0.00';

        foreach ($transactions as $transaction) {
            if ($transaction->getType() === 'income') {
                $totalIncome = bcadd($totalIncome, $transaction->getAmount(), 2);
            } else {
                $totalExpense = bcadd($totalExpense, $transaction->getAmount(), 2);
            }
        }

        return $this->json([
            'accountId' => $account->getId(),
            'accountName' => $account->getName(),
            'transactions' => $data,
            'summary' => [
                'totalIncome' => $totalIncome,
                'totalExpense' => $totalExpense,
                'balance' => bcsub($totalIncome, $totalExpense, 2),
                'count' => count($transactions),
            ],
        ]);
    }

    /**
     * Get transactions by type
     * GET /api/transactions/type/{type}
     */
    #[Route('/type/{type}', name: 'type_transactions', methods: ['GET'])]
    public function getTransactionsByType(string $type): JsonResponse
    {
        if (!in_array($type, ['income', 'expense'])) {
            return $this->json(
                ['error' => 'Type must be either "income" or "expense"'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $transactions = $this->transactionRepository->findBy(
            ['type' => $type],
            ['date' => 'DESC']
        );

        $data = array_map(function (Transaction $transaction) {
            return $this->formatTransaction($transaction);
        }, $transactions);

        $total = array_reduce($transactions, function ($sum, Transaction $transaction) {
            return bcadd($sum, $transaction->getAmount(), 2);
        }, '0.00');

        return $this->json([
            'type' => $type,
            'transactions' => $data,
            'total' => $total,
            'count' => count($transactions),
        ]);
    }

    /**
     * Helper method to format transaction data
     */
    private function formatTransaction(Transaction $transaction): array
    {
        return [
            'id' => $transaction->getId(),
            'accountId' => $transaction->getAccount()?->getId(),
            'accountName' => $transaction->getAccount()?->getName(),
            'userId' => $transaction->getAccount()?->getUser()?->getId(),
            'userEmail' => $transaction->getAccount()?->getUser()?->getEmail(),
            'amount' => $transaction->getAmount(),
            'type' => $transaction->getType(),
            'category' => $transaction->getCategory(),
            'description' => $transaction->getDescription(),
            'date' => $transaction->getDate()?->format('Y-m-d'),
            'createdAt' => $transaction->getCreatedAt()?->format('Y-m-d H:i:s'),
        ];
    }
}
