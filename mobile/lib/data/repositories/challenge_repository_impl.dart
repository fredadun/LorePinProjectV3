import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:uuid/uuid.dart';
import '../../domain/entities/challenge_entity.dart';
import '../../domain/entities/submission_entity.dart';
import '../../domain/repositories/challenge_repository.dart';

/// Implementation of the [ChallengeRepository] interface
class ChallengeRepositoryImpl implements ChallengeRepository {
  final FirebaseFirestore _firestore;
  final FirebaseStorage _storage;
  final Uuid _uuid = const Uuid();

  /// Creates a new instance of [ChallengeRepositoryImpl]
  ChallengeRepositoryImpl(this._firestore, this._storage);

  @override
  Future<ChallengeEntity> getChallengeById(String challengeId) async {
    try {
      final docSnapshot = await _firestore.collection('challenges').doc(challengeId).get();
      
      if (!docSnapshot.exists) {
        throw Exception('Challenge not found');
      }
      
      final data = docSnapshot.data() as Map<String, dynamic>;
      return ChallengeEntity.fromMap({
        'challengeId': challengeId,
        ...data,
      });
    } catch (e) {
      throw Exception('Failed to get challenge: ${e.toString()}');
    }
  }

  @override
  Future<List<ChallengeEntity>> getAllChallenges() async {
    try {
      final querySnapshot = await _firestore
          .collection('challenges')
          .orderBy('startDate', descending: true)
          .get();
      
      return querySnapshot.docs.map((doc) {
        return ChallengeEntity.fromMap({
          'challengeId': doc.id,
          ...doc.data(),
        });
      }).toList();
    } catch (e) {
      throw Exception('Failed to get challenges: ${e.toString()}');
    }
  }

  @override
  Future<List<ChallengeEntity>> getChallengesNearLocation(
    GeoPoint location,
    double radiusInKm,
  ) async {
    try {
      // Note: This is a simplified implementation
      // In a real app, you would use a geospatial query library like GeoFirestore
      // or implement a more sophisticated algorithm to filter by distance
      
      // For now, we'll fetch all challenges and filter them by a rough distance calculation
      final querySnapshot = await _firestore
          .collection('challenges')
          .where('endDate', isGreaterThan: Timestamp.now())
          .get();
      
      final challenges = querySnapshot.docs.map((doc) {
        return ChallengeEntity.fromMap({
          'challengeId': doc.id,
          ...doc.data(),
        });
      }).toList();
      
      // Filter challenges by distance
      return challenges.where((challenge) {
        final distance = _calculateDistance(
          location.latitude,
          location.longitude,
          challenge.location.latitude,
          challenge.location.longitude,
        );
        return distance <= radiusInKm;
      }).toList();
    } catch (e) {
      throw Exception('Failed to get challenges near location: ${e.toString()}');
    }
  }

  @override
  Future<List<ChallengeEntity>> getFeaturedChallenges() async {
    try {
      final querySnapshot = await _firestore
          .collection('challenges')
          .where('isFeatured', isEqualTo: true)
          .where('endDate', isGreaterThan: Timestamp.now())
          .orderBy('endDate')
          .limit(10)
          .get();
      
      return querySnapshot.docs.map((doc) {
        return ChallengeEntity.fromMap({
          'challengeId': doc.id,
          ...doc.data(),
        });
      }).toList();
    } catch (e) {
      throw Exception('Failed to get featured challenges: ${e.toString()}');
    }
  }

  @override
  Future<List<ChallengeEntity>> getChallengesBySponsor(String sponsorId) async {
    try {
      final querySnapshot = await _firestore
          .collection('challenges')
          .where('sponsorId', isEqualTo: sponsorId)
          .orderBy('startDate', descending: true)
          .get();
      
      return querySnapshot.docs.map((doc) {
        return ChallengeEntity.fromMap({
          'challengeId': doc.id,
          ...doc.data(),
        });
      }).toList();
    } catch (e) {
      throw Exception('Failed to get challenges by sponsor: ${e.toString()}');
    }
  }

  @override
  Future<List<ChallengeEntity>> getActiveChallenges() async {
    try {
      final now = Timestamp.now();
      final querySnapshot = await _firestore
          .collection('challenges')
          .where('startDate', isLessThanOrEqualTo: now)
          .where('endDate', isGreaterThan: now)
          .orderBy('startDate')
          .get();
      
      return querySnapshot.docs.map((doc) {
        return ChallengeEntity.fromMap({
          'challengeId': doc.id,
          ...doc.data(),
        });
      }).toList();
    } catch (e) {
      throw Exception('Failed to get active challenges: ${e.toString()}');
    }
  }

  @override
  Future<SubmissionEntity> submitChallenge({
    required String challengeId,
    required String userId,
    required String userName,
    required List<String> mediaUrls,
    required String description,
    required GeoPoint location,
  }) async {
    try {
      // Check if challenge exists and is active
      final challengeDoc = await _firestore.collection('challenges').doc(challengeId).get();
      
      if (!challengeDoc.exists) {
        throw Exception('Challenge not found');
      }
      
      final challengeData = challengeDoc.data() as Map<String, dynamic>;
      final now = Timestamp.now();
      final startDate = challengeData['startDate'] as Timestamp;
      final endDate = challengeData['endDate'] as Timestamp;
      
      if (now.compareTo(startDate) < 0) {
        throw Exception('Challenge has not started yet');
      }
      
      if (now.compareTo(endDate) > 0) {
        throw Exception('Challenge has already ended');
      }
      
      // Create submission
      final submissionId = _uuid.v4();
      final submissionRef = _firestore.collection('submissions').doc(submissionId);
      
      final submission = SubmissionEntity(
        submissionId: submissionId,
        challengeId: challengeId,
        userId: userId,
        userName: userName,
        mediaUrls: mediaUrls,
        description: description,
        location: location,
        createdAt: now.toDate(),
        status: SubmissionStatus.pending,
      );
      
      await submissionRef.set(submission.toMap());
      
      // Update challenge completion count
      await _firestore.collection('challenges').doc(challengeId).update({
        'completionCount': FieldValue.increment(1),
      });
      
      return submission;
    } catch (e) {
      throw Exception('Failed to submit challenge: ${e.toString()}');
    }
  }

  @override
  Future<List<SubmissionEntity>> getSubmissionsForChallenge(String challengeId) async {
    try {
      final querySnapshot = await _firestore
          .collection('submissions')
          .where('challengeId', isEqualTo: challengeId)
          .orderBy('createdAt', descending: true)
          .get();
      
      return querySnapshot.docs.map((doc) {
        return SubmissionEntity.fromMap(doc.data());
      }).toList();
    } catch (e) {
      throw Exception('Failed to get submissions for challenge: ${e.toString()}');
    }
  }

  @override
  Future<List<SubmissionEntity>> getSubmissionsByUser(String userId) async {
    try {
      final querySnapshot = await _firestore
          .collection('submissions')
          .where('userId', isEqualTo: userId)
          .orderBy('createdAt', descending: true)
          .get();
      
      return querySnapshot.docs.map((doc) {
        return SubmissionEntity.fromMap(doc.data());
      }).toList();
    } catch (e) {
      throw Exception('Failed to get submissions by user: ${e.toString()}');
    }
  }

  @override
  Future<SubmissionEntity> getSubmissionById(String submissionId) async {
    try {
      final docSnapshot = await _firestore.collection('submissions').doc(submissionId).get();
      
      if (!docSnapshot.exists) {
        throw Exception('Submission not found');
      }
      
      return SubmissionEntity.fromMap(docSnapshot.data()!);
    } catch (e) {
      throw Exception('Failed to get submission: ${e.toString()}');
    }
  }

  /// Calculates the distance between two points in kilometers using the Haversine formula
  double _calculateDistance(
    double lat1,
    double lon1,
    double lat2,
    double lon2,
  ) {
    const p = 0.017453292519943295; // Math.PI / 180
    const c = 12742; // 2 * Earth's radius in km
    
    final a = 0.5 -
        (((lat2 - lat1) * p) / 2).cos() / 2 +
        ((lat1 * p).cos() * (lat2 * p).cos() * (1 - ((lon2 - lon1) * p).cos())) / 2;
    
    return c * (2 * a.asin());
  }
} 