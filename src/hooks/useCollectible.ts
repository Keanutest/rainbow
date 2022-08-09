import { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { uniqueTokensQueryKey } from './useFetchUniqueTokens';
import { revalidateUniqueToken } from '@rainbow-me/redux/uniqueTokens';

export default function useCollectible(
  initialAsset: any,
  { revalidateInBackground = false } = {},
  externalAddress?: any
) {
  // Retrieve the unique tokens belonging to the current account address.
  const selfUniqueTokens = useSelector(
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'uniqueTokens' does not exist on type 'De... Remove this comment to see the full error message
    ({ uniqueTokens: { uniqueTokens } }) => uniqueTokens
  );
  const { data: externalUniqueTokens } = useQuery(
    uniqueTokensQueryKey({ address: externalAddress }),
    // We just want to watch for changes in the query key,
    // so just supplying a noop function & staleTime of Infinity.
    async () => [],
    { staleTime: Infinity }
  );
  const isExternal = Boolean(externalAddress);
  // Use the appropriate tokens based on if the user is viewing the
  // current accounts tokens, or external tokens (e.g. ProfileSheet)
  const uniqueTokens = useMemo(
    () => (isExternal ? externalUniqueTokens : selfUniqueTokens),
    [externalUniqueTokens, isExternal, selfUniqueTokens]
  );

  const asset = useMemo(() => {
    let matched = uniqueTokens.find(
      (uniqueToken: any) => uniqueToken.uniqueId === initialAsset?.uniqueId
    );
    return matched || initialAsset;
  }, [initialAsset, uniqueTokens]);

  useRevalidateInBackground({
    contractAddress: asset?.asset_contract?.address,
    enabled: revalidateInBackground && !isExternal,
    isExternal,
    tokenId: asset?.id,
  });

  return { ...asset, isExternal };
}

function useRevalidateInBackground({
  contractAddress,
  tokenId,
  isExternal,
  enabled,
}: any) {
  const dispatch = useDispatch();
  useEffect(() => {
    // If `forceUpdate` is truthy, we want to force refresh the metadata from OpenSea &
    // update in the background. Useful for refreshing ENS metadata to resolve "Unknown ENS name".
    if (enabled && contractAddress) {
      // Revalidate the updated asset in the background & update the `uniqueTokens` cache.
      dispatch(
        revalidateUniqueToken(contractAddress, tokenId, {
          forceUpdate: true,
        })
      );
    }
  }, [contractAddress, dispatch, enabled, isExternal, tokenId]);
}