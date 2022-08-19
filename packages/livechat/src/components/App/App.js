import { Router } from 'preact-router';
import { lazy, Suspense } from 'preact/compat';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { parse } from 'query-string';
import { useTranslation } from 'react-i18next';

import history from '../../history';
import Connection from '../../lib/connection';
import CustomFields from '../../lib/customFields';
import Hooks from '../../lib/hooks';
import { isRTL } from '../../lib/isRTL';
import { parentCall } from '../../lib/parentCall';
import userPresence from '../../lib/userPresence';
import { visibility, isActiveSession } from '../helpers';
import { handleDisableNotifications, handleDismissAlert, handleEnableNotifications, handleMinimize, handleOpenWindow, handleRestore, handleRoute, handleTriggers, handleVisibilityChange } from './handlers';


export const App = ({
	config,
	gdpr,
	triggered,
	user,
	sound,
	undocked,
	minimized,
	expanded,
	alerts,
	modal,
	dispatch,
	iframe,
}) => {
	const { t } = useTranslation();
	const [state, setState] = useState(() => ({ initialized: false, poppedOut: false }));

	const dismissNotification = useCallback(() => !isActiveSession(), []);

	const fn = useMemo(() => handleVisibilityChange(dispatch), [dispatch]);

	const checkPoppedOutWindow = () => {
		// Checking if the window is poppedOut and setting parent minimized if yes for the restore purpose
		const { dispatch } = this.props;
		const poppedOut = parse(window.location.search).mode === 'popout';

		setState((prevState) => ({ ...prevState, poppedOut }));

		if (poppedOut) {
			dispatch({ minimized: false });
		}
	};

	const screenProps = {
		notificationsEnabled: sound && sound.enabled,
		minimized: !state.poppedOut && (minimized || undocked),
		expanded: !minimized && expanded,
		windowed: !minimized && state.poppedOut,
		sound,
		alerts,
		modal,
		onEnableNotifications: () => handleEnableNotifications({ dispatch, sound }),
		onDisableNotifications: () => handleDisableNotifications({ dispatch, sound }),
		onMinimize: () => handleMinimize(dispatch),
		onRestore: () => handleRestore({ dispatch, undocked }),
		onOpenWindow: () => handleOpenWindow(dispatch),
		onDismissAlert: (id) => handleDismissAlert(dispatch, alerts, id),
		dismissNotification,
	};

	useEffect(() => {
		const initWidget = () => {
			parentCall(minimized ? 'minimizeWindow' : 'restoreWindow');
			parentCall(iframe.visible ? 'showWidget' : 'hideWidget');

			visibility.addListener(fn);
			this.handleVisibilityChange();
			window.addEventListener('beforeunload', () => {
				visibility.removeListener(fn);
				dispatch({ minimized: true, undocked: false });
			});
		};

		const initialize = async () => {
			// TODO: split these behaviors into composable components
			await Connection.init();
			CustomFields.init();
			userPresence.init();
			Hooks.init();
			handleTriggers(config);
			initWidget();
			checkPoppedOutWindow();
			setState((prevState) => ({ ...prevState, initialized: true }));
			parentCall('ready');
		};

		const finalize = async () => {
			CustomFields.reset();
			userPresence.reset();
			visibility.removeListener(fn);
		};

		initialize();
		return () => {
			finalize();
		};
	}, [config, dispatch, fn, iframe.visible, minimized]);

	useEffect(() => {
		document.dir = isRTL(t('yes')) ? 'rtl' : 'ltr';
	}, [t]);

	if (!state.initialized) {
		return null;
	}

	const ChatConnectorComponent = lazy(() => import('../../routes/Chat'));
	const ChatFinishedComponent = lazy(() => import('../../routes/ChatFinished'));
	const GDPRAgreementComponent = lazy(() => import('../../routes/GDPRAgreement'));
	const LeaveMessageComponent = lazy(() => import('../../routes/LeaveMessage'));
	const RegisterComponent = lazy(() => import('../../routes/Register'));
	const SwitchDepartmentComponent = lazy(() => import('../../routes/SwitchDepartment'));
	const TriggerMessageComponent = lazy(() => import('../../routes/TriggerMessage'));

	return (
		<Router history={history} onChange={() => handleRoute({ config, gdpr, triggered, user })}>
			<Suspense fallback={null}>
				<ChatConnectorComponent default path='/' {...screenProps} />
				<ChatFinishedComponent path='/chat-finished' {...screenProps} />
				<GDPRAgreementComponent path='/gdpr' {...screenProps} />
				<LeaveMessageComponent path='/leave-message' {...screenProps} />
				<RegisterComponent path='/register' {...screenProps} />
				<SwitchDepartmentComponent path='/switch-department' {...screenProps} />
				<TriggerMessageComponent path='/trigger-messages' {...screenProps} />
			</Suspense>
		</Router>
	);
};

export default App;
