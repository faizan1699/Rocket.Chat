import type { IDiscussionMessage, IUser } from '@rocket.chat/core-typings';
import type { MouseEvent } from 'react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useTimeAgo } from '../../../../hooks/useTimeAgo';
import { normalizeThreadMessage } from '../../../../lib/normalizeThreadMessage';
import DiscussionListMessage from './components/DiscussionsListItem';

type DiscussionListRowProps = {
	discussion: IDiscussionMessage;
	showRealNames: boolean;
	userId: IUser['_id'];
	onClick: (e: MouseEvent<HTMLElement>) => void;
};

function DiscussionListRow({ discussion, showRealNames, userId, onClick }: DiscussionListRowProps) {
	const { t } = useTranslation();
	const formatDate = useTimeAgo();

	const msg = normalizeThreadMessage(discussion);

	const { name = discussion.u.username } = discussion.u;

	return (
		<DiscussionListMessage
			replies={discussion.replies}
			dcount={discussion.dcount}
			dlm={discussion.dlm}
			name={showRealNames ? name : discussion.u.username}
			username={discussion.u.username}
			following={discussion.replies?.includes(userId)}
			data-drid={discussion.drid}
			ts={discussion.ts}
			msg={msg}
			t={t}
			formatDate={formatDate}
			onClick={onClick}
		/>
	);
}

export default memo(DiscussionListRow);
