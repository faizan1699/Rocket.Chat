import { css } from '@rocket.chat/css-in-js';
import { Box } from '@rocket.chat/fuselage';
import { UserAvatar } from '@rocket.chat/ui-avatar';
import { useSetting, useUser } from '@rocket.chat/ui-contexts';
import React from 'react';

import { UserStatus } from '../../components/UserStatus';

const anon = {
	_id: '',
	username: 'Anonymous',
	status: 'online',
	avatarETag: undefined,
} as const;

/**
 * @deprecated Moved to NavBar
 * @description duplicated in apps/meteor/client/NavBar/UserMenu/UserAvatarWithStatus.tsx until feature is ready
 * @memberof newNavigation
 */

const UserAvatarWithStatus = () => {
	const user = useUser();
	const presenceDisabled = useSetting<boolean>('Presence_broadcast_disabled');

	const { status = !user ? 'online' : 'offline', username, avatarETag } = user || anon;

	return (
		<Box
			position='relative'
			className={css`
				cursor: pointer;
			`}
		>
			{username && <UserAvatar size='x24' username={username} etag={avatarETag} />}
			<Box
				className={css`
					bottom: 0;
					right: 0;
				`}
				justifyContent='center'
				alignItems='center'
				display='flex'
				overflow='hidden'
				size='x12'
				borderWidth='default'
				position='absolute'
				bg='surface-tint'
				borderColor='extra-light'
				borderRadius='full'
				mie='neg-x2'
				mbe='neg-x2'
			>
				<UserStatus small status={presenceDisabled ? 'disabled' : status} />
			</Box>
		</Box>
	);
};

export default UserAvatarWithStatus;
