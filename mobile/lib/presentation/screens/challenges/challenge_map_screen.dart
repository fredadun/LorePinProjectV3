import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../domain/providers/challenge_provider.dart';
import '../../../domain/entities/challenge_entity.dart';

/// Screen that displays challenges on a map
class ChallengeMapScreen extends ConsumerWidget {
  /// Creates a new instance of [ChallengeMapScreen]
  const ChallengeMapScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch the active challenges provider
    final activeChallengesAsync = ref.watch(activeChallengesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Challenges Map'),
      ),
      body: activeChallengesAsync.when(
        data: (challenges) => _buildChallengesList(context, challenges),
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
                'Error loading challenges',
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
                onPressed: () => ref.refresh(activeChallengesProvider),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: Implement filter functionality
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Filter functionality coming soon'),
            ),
          );
        },
        child: const Icon(Icons.filter_list),
      ),
    );
  }

  /// Builds the list of challenges
  Widget _buildChallengesList(BuildContext context, List<ChallengeEntity> challenges) {
    if (challenges.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.search_off,
              size: 60,
              color: Colors.grey,
            ),
            const SizedBox(height: 16),
            Text(
              'No Active Challenges Found',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(
              'Check back later for new challenges',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
      );
    }

    // TODO: Replace with actual map implementation
    // For now, just show a list of challenges
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: challenges.length,
      itemBuilder: (context, index) {
        final challenge = challenges[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          child: ListTile(
            contentPadding: const EdgeInsets.all(16),
            title: Text(
              challenge.title,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 8),
                Text(challenge.description),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.location_on, size: 16, color: Colors.grey),
                    const SizedBox(width: 4),
                    Expanded(child: Text(challenge.address)),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.monetization_on, size: 16, color: Colors.amber),
                    const SizedBox(width: 4),
                    Text('${challenge.reward} LoreCoins'),
                  ],
                ),
              ],
            ),
            onTap: () {
              context.go('/challenges/${challenge.challengeId}');
            },
          ),
        );
      },
    );
  }
} 