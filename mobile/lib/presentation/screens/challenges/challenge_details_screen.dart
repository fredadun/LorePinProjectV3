import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../domain/providers/challenge_provider.dart';
import '../../../domain/providers/auth_provider.dart';
import '../../../domain/entities/challenge_entity.dart';

/// Screen that displays challenge details
class ChallengeDetailsScreen extends ConsumerWidget {
  /// The ID of the challenge to display
  final String challengeId;

  /// Creates a new instance of [ChallengeDetailsScreen]
  const ChallengeDetailsScreen({
    Key? key,
    required this.challengeId,
  }) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch the challenge by ID provider
    final challengeAsync = ref.watch(challengeByIdProvider(challengeId));

    return Scaffold(
      body: challengeAsync.when(
        data: (challenge) => _buildChallengeDetails(context, ref, challenge),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.error_outline,
                size: 60,
                color: Colors.red,
              ),
              const SizedBox(height: 16),
              Text(
                'Error loading challenge',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              Text(
                error.toString(),
                style: Theme.of(context).textTheme.bodyMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => ref.refresh(challengeByIdProvider(challengeId)),
                child: const Text('Retry'),
              ),
              const SizedBox(height: 8),
              TextButton(
                onPressed: () => context.pop(),
                child: const Text('Go Back'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Builds the challenge details UI
  Widget _buildChallengeDetails(BuildContext context, WidgetRef ref, ChallengeEntity challenge) {
    final now = DateTime.now();
    final isActive = now.isAfter(challenge.startDate) && now.isBefore(challenge.endDate);
    final isExpired = now.isAfter(challenge.endDate);
    
    return CustomScrollView(
      slivers: [
        // App bar with image
        SliverAppBar(
          expandedHeight: 200,
          pinned: true,
          flexibleSpace: FlexibleSpaceBar(
            title: Text(challenge.title),
            background: challenge.mediaUrls.isNotEmpty
                ? Image.network(
                    challenge.mediaUrls.first,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      color: Colors.grey[300],
                      child: Center(
                        child: Icon(
                          Icons.photo,
                          size: 80,
                          color: Colors.grey[600],
                        ),
                      ),
                    ),
                  )
                : Container(
                    color: Colors.grey[300],
                    child: Center(
                      child: Icon(
                        Icons.photo,
                        size: 80,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
          ),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () {
              context.pop();
            },
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.share),
              onPressed: () {
                // TODO: Implement share functionality
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Share functionality coming soon'),
                  ),
                );
              },
            ),
          ],
        ),
        
        // Challenge details
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Status badge
                _buildStatusBadge(isActive, isExpired),
                const SizedBox(height: 16),
                
                // Location and distance
                Row(
                  children: [
                    const Icon(
                      Icons.location_on,
                      size: 16,
                      color: Colors.grey,
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        challenge.address,
                        style: const TextStyle(
                          color: Colors.grey,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                
                // Reward
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.blue[50],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.monetization_on,
                        color: Color(0xFF3F51B5),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Reward: ${challenge.reward} LoreCoins',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF3F51B5),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                
                // Sponsor
                Row(
                  children: [
                    const Icon(
                      Icons.business,
                      size: 16,
                      color: Colors.grey,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Sponsored by: ${challenge.sponsorName}',
                      style: const TextStyle(
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                
                // Description
                const Text(
                  'Description',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(challenge.description),
                const SizedBox(height: 24),
                
                // Requirements
                const Text(
                  'Requirements',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                ...challenge.requirements.map((req) => Padding(
                  padding: const EdgeInsets.only(bottom: 8.0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(
                        Icons.check_circle_outline,
                        size: 16,
                        color: Colors.green,
                      ),
                      const SizedBox(width: 8),
                      Expanded(child: Text(req)),
                    ],
                  ),
                )),
                const SizedBox(height: 24),
                
                // Dates
                const Text(
                  'Dates',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(
                      Icons.calendar_today,
                      size: 16,
                      color: Colors.grey,
                    ),
                    const SizedBox(width: 8),
                    Text('Start: ${_formatDate(challenge.startDate)}'),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(
                      Icons.event,
                      size: 16,
                      color: Colors.grey,
                    ),
                    const SizedBox(width: 8),
                    Text('End: ${_formatDate(challenge.endDate)}'),
                  ],
                ),
                const SizedBox(height: 24),
                
                // Completion count
                Row(
                  children: [
                    const Icon(
                      Icons.people,
                      size: 16,
                      color: Colors.grey,
                    ),
                    const SizedBox(width: 8),
                    Text('${challenge.completionCount} people completed this challenge'),
                  ],
                ),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ],
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: ElevatedButton(
            onPressed: isActive ? () => _startChallenge(context, ref, challenge) : null,
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
              backgroundColor: const Color(0xFF3F51B5),
              foregroundColor: Colors.white,
              disabledBackgroundColor: Colors.grey,
            ),
            child: Text(
              isExpired ? 'Challenge Ended' : (isActive ? 'Start Challenge' : 'Challenge Not Started Yet'),
              style: const TextStyle(fontSize: 16),
            ),
          ),
        ),
      ),
    );
  }

  /// Builds a status badge based on challenge status
  Widget _buildStatusBadge(bool isActive, bool isExpired) {
    if (isExpired) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.red[100],
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Text(
          'Ended',
          style: TextStyle(
            color: Colors.red,
            fontWeight: FontWeight.bold,
          ),
        ),
      );
    } else if (isActive) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.green[100],
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Text(
          'Active',
          style: TextStyle(
            color: Colors.green,
            fontWeight: FontWeight.bold,
          ),
        ),
      );
    } else {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.orange[100],
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Text(
          'Coming Soon',
          style: TextStyle(
            color: Colors.orange,
            fontWeight: FontWeight.bold,
          ),
        ),
      );
    }
  }

  /// Formats a date to a readable string
  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  /// Starts the challenge submission process
  void _startChallenge(BuildContext context, WidgetRef ref, ChallengeEntity challenge) {
    final authState = ref.read(authProvider);
    
    if (authState.user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('You need to be logged in to start a challenge'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }
    
    // TODO: Navigate to challenge submission screen
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Challenge submission functionality coming soon'),
      ),
    );
  }
} 