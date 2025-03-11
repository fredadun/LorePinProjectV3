import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/challenge_repository_impl.dart';
import '../entities/challenge_entity.dart';
import '../entities/submission_entity.dart';
import '../repositories/challenge_repository.dart';

/// Provider for the challenge repository
final challengeRepositoryProvider = Provider<ChallengeRepository>((ref) {
  final firestore = FirebaseFirestore.instance;
  final storage = FirebaseStorage.instance;
  return ChallengeRepositoryImpl(firestore, storage);
});

/// Provider for all challenges
final allChallengesProvider = FutureProvider<List<ChallengeEntity>>((ref) async {
  final repository = ref.watch(challengeRepositoryProvider);
  return repository.getAllChallenges();
});

/// Provider for active challenges
final activeChallengesProvider = FutureProvider<List<ChallengeEntity>>((ref) async {
  final repository = ref.watch(challengeRepositoryProvider);
  return repository.getActiveChallenges();
});

/// Provider for featured challenges
final featuredChallengesProvider = FutureProvider<List<ChallengeEntity>>((ref) async {
  final repository = ref.watch(challengeRepositoryProvider);
  return repository.getFeaturedChallenges();
});

/// Provider for a specific challenge by ID
final challengeByIdProvider = FutureProvider.family<ChallengeEntity, String>((ref, challengeId) async {
  final repository = ref.watch(challengeRepositoryProvider);
  return repository.getChallengeById(challengeId);
});

/// Provider for challenges near a location
final challengesNearLocationProvider = FutureProvider.family<List<ChallengeEntity>, ({GeoPoint location, double radiusInKm})>(
  (ref, params) async {
    final repository = ref.watch(challengeRepositoryProvider);
    return repository.getChallengesNearLocation(params.location, params.radiusInKm);
  },
);

/// Provider for challenges by sponsor
final challengesBySponsorProvider = FutureProvider.family<List<ChallengeEntity>, String>((ref, sponsorId) async {
  final repository = ref.watch(challengeRepositoryProvider);
  return repository.getChallengesBySponsor(sponsorId);
});

/// Provider for submissions for a challenge
final submissionsForChallengeProvider = FutureProvider.family<List<SubmissionEntity>, String>((ref, challengeId) async {
  final repository = ref.watch(challengeRepositoryProvider);
  return repository.getSubmissionsForChallenge(challengeId);
});

/// Provider for submissions by a user
final submissionsByUserProvider = FutureProvider.family<List<SubmissionEntity>, String>((ref, userId) async {
  final repository = ref.watch(challengeRepositoryProvider);
  return repository.getSubmissionsByUser(userId);
});

/// Provider for a specific submission by ID
final submissionByIdProvider = FutureProvider.family<SubmissionEntity, String>((ref, submissionId) async {
  final repository = ref.watch(challengeRepositoryProvider);
  return repository.getSubmissionById(submissionId);
}); 