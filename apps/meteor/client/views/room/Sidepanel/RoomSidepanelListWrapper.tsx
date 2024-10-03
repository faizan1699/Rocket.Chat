import { SidepanelList } from '@rocket.chat/fuselage';
import { useMergedRefs } from '@rocket.chat/fuselage-hooks';
import { useTranslation } from '@rocket.chat/ui-contexts';
import type { ForwardedRef, HTMLAttributes } from 'react';
import React, { forwardRef, memo } from 'react';

import { useSidebarListNavigation } from '../../../sidebar/RoomList/useSidebarListNavigation';

type RoomListWrapperProps = HTMLAttributes<HTMLDivElement>;

const RoomSidepanelListWrapper = forwardRef(function RoomListWrapper(props: RoomListWrapperProps, ref: ForwardedRef<HTMLDivElement>) {
	const t = useTranslation();
	const { sidebarListRef } = useSidebarListNavigation();
	const mergedRefs = useMergedRefs(ref, sidebarListRef);

	return <SidepanelList aria-label={t('Channels')} ref={mergedRefs} {...props} />;
});

export default memo(RoomSidepanelListWrapper);