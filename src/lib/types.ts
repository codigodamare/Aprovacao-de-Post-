export type PostStatus = "PENDING" | "APPROVED" | "CHANGES_REQUESTED";
export type MediaType = "IMAGE" | "VIDEO";
export type Role = "AGENCY" | "CLIENT";

export type CommentDTO = {
  id: string;
  text: string;
  authorRole: Role;
  createdAt: string;
  author: { email: string; role: Role };
};

export type PostDTO = {
  id: string;
  clientId: string;
  mediaUrl: string;
  mediaType: MediaType;
  caption: string;
  scheduledDate: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  comments: CommentDTO[];
};
