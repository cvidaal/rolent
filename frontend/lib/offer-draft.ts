const OFFER_DRAFT_KEY = "rolent:offer-draft";

export function saveOfferDraft(offer: string) {
  sessionStorage.setItem(OFFER_DRAFT_KEY, offer);
}

export function takeOfferDraft() {
  const offer = sessionStorage.getItem(OFFER_DRAFT_KEY) ?? "";
  sessionStorage.removeItem(OFFER_DRAFT_KEY);
  return offer;
}
