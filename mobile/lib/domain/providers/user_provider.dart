import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/user_repository_impl.dart';
import '../entities/user_entity.dart';
import '../entities/lorecoin_transaction_entity.dart';
import '../repositories/user_repository.dart';

/// Provider for the user repository
final userRepositoryProvider = Provider<UserRepository>((ref) {
  final firestore = FirebaseFirestore.instance;
  return UserRepositoryImpl(firestore);
});

/// Provider for a specific user by ID
final userByIdProvider = FutureProvider.family<UserEntity, String>((ref, userId) async {
  final repository = ref.watch(userRepositoryProvider);
  return repository.getUserById(userId);
});

/// Provider for a user's followers
final userFollowersProvider = FutureProvider.family<List<UserEntity>, String>((ref, userId) async {
  final repository = ref.watch(userRepositoryProvider);
  return repository.getFollowers(userId);
});

/// Provider for users that a user is following
final userFollowingProvider = FutureProvider.family<List<UserEntity>, String>((ref, userId) async {
  final repository = ref.watch(userRepositoryProvider);
  return repository.getFollowing(userId);
});

/// Provider for a user's LoreCoin balance
final loreCoinBalanceProvider = FutureProvider.family<int, String>((ref, userId) async {
  final repository = ref.watch(userRepositoryProvider);
  return repository.getLoreCoinBalance(userId);
});

/// Provider for a user's LoreCoin transactions
final loreCoinTransactionsProvider = FutureProvider.family<List<LoreCoinTransactionEntity>, String>((ref, userId) async {
  final repository = ref.watch(userRepositoryProvider);
  return repository.getLoreCoinTransactions(userId);
}); 