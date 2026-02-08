<?php

namespace App\Controller;

use App\Entity\Account;
use App\Repository\AccountRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/accounts', name: 'api_accounts_')]
class AccountController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private AccountRepository $accountRepository,
        private UserRepository $userRepository
    ) {
    }

    /**
     * Get all accounts
     * GET /api/accounts
     */
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $accounts = $this->accountRepository->findAll();

        $data = array_map(function (Account $account) {
            return [
                'id' => $account->getId(),
                'userId' => $account->getUser()?->getId(),
                'userEmail' => $account->getUser()?->getEmail(),
                'name' => $account->getName(),
                'balance' => $account->getBalance(),
                'createdAt' => $account->getCreatedAt()?->format('Y-m-d H:i:s'),
            ];
        }, $accounts);

        return $this->json($data);
    }

    /**
     * Get single account
     * GET /api/accounts/{id}
     */
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $account = $this->accountRepository->find($id);

        if (!$account) {
            return $this->json(['error' => 'Account not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'id' => $account->getId(),
            'userId' => $account->getUser()?->getId(),
            'userEmail' => $account->getUser()?->getEmail(),
            'name' => $account->getName(),
            'balance' => $account->getBalance(),
            'createdAt' => $account->getCreatedAt()?->format('Y-m-d H:i:s'),
        ]);
    }

    /**
     * Create new account
     * POST /api/accounts
     * Body: {"userId": 1, "name": "Checking Account", "balance": "1000.00"}
     */
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validation
        if (!isset($data['userId']) || !isset($data['name'])) {
            return $this->json(
                ['error' => 'userId and name are required'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // Check if user exists
        $user = $this->userRepository->find($data['userId']);
        if (!$user) {
            return $this->json(
                ['error' => 'User not found'],
                Response::HTTP_NOT_FOUND
            );
        }

        // Validate balance format (if provided)
        $balance = $data['balance'] ?? '0.00';
        if (!is_numeric($balance)) {
            return $this->json(
                ['error' => 'Balance must be a valid number'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // Create account
        $account = new Account();
        $account->setUser($user);
        $account->setName($data['name']);
        $account->setBalance(number_format((float)$balance, 2, '.', ''));

        $this->entityManager->persist($account);
        $this->entityManager->flush();

        return $this->json([
            'id' => $account->getId(),
            'userId' => $account->getUser()?->getId(),
            'userEmail' => $account->getUser()?->getEmail(),
            'name' => $account->getName(),
            'balance' => $account->getBalance(),
            'createdAt' => $account->getCreatedAt()?->format('Y-m-d H:i:s'),
        ], Response::HTTP_CREATED);
    }

    /**
     * Update account
     * PUT /api/accounts/{id}
     * Body: {"name": "Savings Account", "balance": "2500.50"}
     */
    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $account = $this->accountRepository->find($id);

        if (!$account) {
            return $this->json(['error' => 'Account not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        // Update name if provided
        if (isset($data['name'])) {
            $account->setName($data['name']);
        }

        // Update balance if provided
        if (isset($data['balance'])) {
            if (!is_numeric($data['balance'])) {
                return $this->json(
                    ['error' => 'Balance must be a valid number'],
                    Response::HTTP_BAD_REQUEST
                );
            }
            $account->setBalance(number_format((float)$data['balance'], 2, '.', ''));
        }

        // Update user if provided (change ownership)
        if (isset($data['userId'])) {
            $user = $this->userRepository->find($data['userId']);
            if (!$user) {
                return $this->json(
                    ['error' => 'User not found'],
                    Response::HTTP_NOT_FOUND
                );
            }
            $account->setUser($user);
        }

        $this->entityManager->flush();

        return $this->json([
            'id' => $account->getId(),
            'userId' => $account->getUser()?->getId(),
            'userEmail' => $account->getUser()?->getEmail(),
            'name' => $account->getName(),
            'balance' => $account->getBalance(),
            'createdAt' => $account->getCreatedAt()?->format('Y-m-d H:i:s'),
        ]);
    }

    /**
     * Delete account
     * DELETE /api/accounts/{id}
     */
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $account = $this->accountRepository->find($id);

        if (!$account) {
            return $this->json(['error' => 'Account not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($account);
        $this->entityManager->flush();

        return $this->json(['message' => 'Account deleted successfully']);
    }

    /**
     * Get all accounts for a specific user
     * GET /api/accounts/user/{userId}
     */
    #[Route('/user/{userId}', name: 'user_accounts', methods: ['GET'])]
    public function getUserAccounts(int $userId): JsonResponse
    {
        $user = $this->userRepository->find($userId);

        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $accounts = $this->accountRepository->findBy(['user' => $user]);

        $data = array_map(function (Account $account) {
            return [
                'id' => $account->getId(),
                'name' => $account->getName(),
                'balance' => $account->getBalance(),
                'createdAt' => $account->getCreatedAt()?->format('Y-m-d H:i:s'),
            ];
        }, $accounts);

        return $this->json([
            'userId' => $user->getId(),
            'userEmail' => $user->getEmail(),
            'accounts' => $data,
            'totalBalance' => array_reduce($accounts, function ($sum, Account $account) {
                return bcadd($sum, $account->getBalance(), 2);
            }, '0.00'),
        ]);
    }
}
