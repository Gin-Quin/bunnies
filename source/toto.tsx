Box({ padding: defaultSpace }, [
	Box({ display: "grid", paddingX: formPaddingX, rowGap: defaultSpace }, [
		Box([
			Typography({ variant: "body1", color: "primary" }, [
				intl.formatMessage({
					id: `${TRAD_PATH}.managementModeReminder`,
				}),
			]),
			Typography({ variant: "h2", color: "primary" }, [
				intl.formatMessage({ id: `managementMode.${managementMode}` }),
			]),
		]),

		ToggleButtonsController({
			name: "scheduledPaymentsManagementMode",
			dataCy: "scheduledPaymentsManagement-managementMode",
			label: intl.formatMessage({ id: `${TRAD_PATH}.scheduledPaymentsManagementMode` }),
			options: [
				ScheduledPaymentsManagementMode.Free,
				getBaseManagementMode(managementMode),
			].map(mode => ({
				value: mode,
				label: intl.formatMessage({
					id: `managementMode.${mode}`,
				}),
				disabled: isReadonly,
			})),
		}),

		when(
			scheduledPaymentsManagementMode === ScheduledPaymentsManagementMode.UnderMandate &&
				mandateName,
			Text({
				color: "primary",
				label: intl.formatMessage({ id: `${TRAD_PATH}.mandateNameReminder` }),
				value: intl.formatMessage({
					id: `mandateName.${mandateName}`,
				}),
			})
		),
	]),
])
;<Box padding={defaultSpace}>
	<Box display="grid" paddingX={formPaddingX} rowGap={defaultSpace}>
		<Box>
			<Typography variant="body1" color="primary">
				{intl.formatMessage({
					id: `${TRAD_PATH}.managementModeReminder`,
				})}
			</Typography>
			<Typography color="primary" variant="h2" marginTop={1}>
				{intl.formatMessage({ id: `managementMode.${managementMode}` })}
			</Typography>
		</Box>

		<ToggleButtonsController
			name="scheduledPaymentsManagementMode"
			label={intl.formatMessage({ id: `${TRAD_PATH}.scheduledPaymentsManagementMode` })}
			options={[
				ScheduledPaymentsManagementMode.Free,
				getBaseManagementMode(managementMode),
			].map(mode => ({
				value: mode,
				label: intl.formatMessage({
					id: `managementMode.${mode}`,
				}),
				disabled: isReadonly,
			}))}
			dataCy="scheduledPaymentsManagement-managementMode"
		/>
		{scheduledPaymentsManagementMode === ScheduledPaymentsManagementMode.UnderMandate &&
			mandateName && (
				<Text
					color="primary"
					label={intl.formatMessage({ id: `${TRAD_PATH}.mandateNameReminder` })}
					value={intl.formatMessage({
						id: `mandateName.${mandateName}`,
					})}
				/>
			)}
	</Box>
</Box>
