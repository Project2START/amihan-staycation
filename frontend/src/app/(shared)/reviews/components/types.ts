export type ReviewUnitPreview = {
  id: string;
  name: string;
  thumbnailUrl: string | null;
  thumbnailAlt: string;
};

export type ReviewItemData = {
  id: string;
  rating: number;
  comment: string | null;
  isImported: boolean;
  isHidden: boolean;
  source: string | null;
  createdAt: string;
  reviewerName: string;
  reviewerAvatarUrl: string | null;
};

export type ProductReviewsResponse = {
  unit: ReviewUnitPreview | null;
  reviews: ReviewItemData[];
};

export type EligibilityData = {
  canSubmit: boolean;
  reason: string;
  bookingId: string | null;
  reviewWindowEndsAt: string | null;
  unit: ReviewUnitPreview | null;
};
