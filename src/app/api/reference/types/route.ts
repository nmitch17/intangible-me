import { NextRequest, NextResponse } from 'next/server';
import type { TypeReference, HumanDesignType, Strategy, AuthorityReference, Authority } from '@/types';

/**
 * Human Design Type reference data
 */
const TYPE_REFERENCES: Record<HumanDesignType, TypeReference & { description: string }> = {
  'Manifestor': {
    id: 'Manifestor',
    strategy: 'Inform',
    signature: 'Peace',
    not_self: 'Anger',
    description: 'Manifestors are the initiators. They are here to make things happen and impact others. They have a closed and repelling aura. Their strategy is to inform before they act to minimize resistance.',
  },
  'Generator': {
    id: 'Generator',
    strategy: 'Wait to Respond',
    signature: 'Satisfaction',
    not_self: 'Frustration',
    description: 'Generators are the life force of the planet. They have an open and enveloping aura. Their strategy is to wait to respond to life rather than initiate. When they respond correctly, they experience satisfaction.',
  },
  'Manifesting Generator': {
    id: 'Manifesting Generator',
    strategy: 'Wait to Respond',
    signature: 'Satisfaction',
    not_self: 'Frustration',
    description: 'Manifesting Generators are a hybrid type combining Generator and Manifestor qualities. They have the sacral response of Generators but can initiate like Manifestors once they respond. They are multi-passionate and efficient.',
  },
  'Projector': {
    id: 'Projector',
    strategy: 'Wait for Invitation',
    signature: 'Success',
    not_self: 'Bitterness',
    description: 'Projectors are the guides and coordinators. They have a focused and absorbing aura. Their strategy is to wait for recognition and invitation, especially for major life decisions. When invited correctly, they experience success.',
  },
  'Reflector': {
    id: 'Reflector',
    strategy: 'Wait Lunar Cycle',
    signature: 'Surprise',
    not_self: 'Disappointment',
    description: 'Reflectors are the rarest type, mirrors of their environment. They have a resistant and sampling aura. Their strategy is to wait a full lunar cycle (28 days) before making major decisions. They reflect the health of their community.',
  },
};

/**
 * Authority reference data
 */
const AUTHORITY_REFERENCES: Record<Authority, AuthorityReference & { description: string }> = {
  'Emotional': {
    id: 'Emotional',
    name: 'Emotional Authority',
    center: 'solar_plexus',
    description: 'The most common authority. Those with Emotional Authority must wait through their emotional wave before making decisions. There is no truth in the now for them - clarity comes over time.',
  },
  'Sacral': {
    id: 'Sacral',
    name: 'Sacral Authority',
    center: 'sacral',
    description: 'Sacral Authority is an in-the-moment, gut response. It responds with sounds (uh-huh/uhn-uhn) or bodily sensations. The key is to listen to the immediate sacral response, not the mind.',
  },
  'Splenic': {
    id: 'Splenic',
    name: 'Splenic Authority',
    center: 'spleen',
    description: 'Splenic Authority is intuitive and in-the-moment. It speaks once, very quietly, often as a knowing or spontaneous awareness. The challenge is learning to trust these subtle, spontaneous hits of awareness.',
  },
  'Ego': {
    id: 'Ego',
    name: 'Ego Authority',
    center: 'ego',
    description: 'Ego Authority (Manifested or Projected) comes from the Heart/Ego center. These people make decisions based on what they want and what serves them. Their willpower is their guide.',
  },
  'Self-Projected': {
    id: 'Self-Projected',
    name: 'Self-Projected Authority',
    center: 'g',
    description: 'Self-Projected Authority requires talking it out. By hearing themselves speak about a decision, they gain clarity about their direction. They need to listen to what they say, not what others say.',
  },
  'Mental': {
    id: 'Mental',
    name: 'Mental/Environmental Authority',
    description: 'Mental Authority (also called Environmental or Outer Authority) means discussing decisions with trusted others and being in the right environment. The mind is not for decision-making but for processing and discussing.',
  },
  'Lunar': {
    id: 'Lunar',
    name: 'Lunar Authority',
    description: 'Lunar Authority is unique to Reflectors. They must wait a full lunar cycle (28 days) before making major decisions, allowing them to experience all lunar transits and gain full perspective.',
  },
};

/**
 * GET /api/reference/types
 * Returns Human Design types and authorities reference data
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as HumanDesignType | null;
    const authority = searchParams.get('authority') as Authority | null;
    const category = searchParams.get('category'); // 'types' or 'authorities'

    // Return specific type
    if (type && TYPE_REFERENCES[type]) {
      return NextResponse.json({
        data: TYPE_REFERENCES[type],
      });
    }

    // Return specific authority
    if (authority && AUTHORITY_REFERENCES[authority]) {
      return NextResponse.json({
        data: AUTHORITY_REFERENCES[authority],
      });
    }

    // Return filtered by category
    if (category === 'authorities') {
      return NextResponse.json({
        data: Object.values(AUTHORITY_REFERENCES),
      });
    }

    // Return all types (default)
    return NextResponse.json({
      data: {
        types: Object.values(TYPE_REFERENCES),
        authorities: Object.values(AUTHORITY_REFERENCES),
      },
    });
  } catch (error) {
    console.error('Types reference error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
