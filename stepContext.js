WaterfallStepContext {
    services: TurnContextStateCollection(0) [Map] {},
    dialogs: DialogSet {
      dialogs: {
        textPrompt: [TextPrompt],
        confirmPrompt: [ConfirmPrompt],
        cardPrompt: [ChoicePrompt],
        waterfallDialog: [WaterfallDialog]
      },
      dialogState: undefined,
      _version: '-451568140'
    },
    context: TurnContext {
      _respondedRef: { responded: false },
      _turnState: TurnContextStateCollection(10) [Map] {
        Symbol(BotIdentity) => [ClaimsIdentity],
        Symbol(ConnectorClient) => [ConnectorClient],
        Symbol(UserTokenClient) => [UserTokenClientImpl],
        'botCallbackHandler' => [Function (anonymous)],
        Symbol(ConnectorFactory) => [ConnectorFactoryImpl],
        Symbol(OAuthScope) => 'https://api.botframework.com',
        Symbol(state) => [Object],
        'DialogStateManagerConfiguration' => [Object],
        'turn' => [Object],
        Symbol(ActivityReceivedEmitted) => true,
        turn: [Object]
      },
      _onSendActivities: [],
      _onUpdateActivity: [],
      _onDeleteActivity: [],
      _turn: 'turn',
      _locale: 'locale',
      bufferedReplyActivities: [],
      _adapter: CloudAdapter {
        middleware: [MiddlewareSet],
        BotIdentityKey: Symbol(BotIdentity),
        ConnectorClientKey: Symbol(ConnectorClient),
        OAuthScopeKey: Symbol(OAuthScope),
        botFrameworkAuthentication: [ConfigurationBotFrameworkAuthentication],
        ConnectorFactoryKey: Symbol(ConnectorFactory),
        UserTokenClientKey: Symbol(UserTokenClient),
        turnError: [AsyncFunction: onTurnErrorHandler]
      },
      _activity: {
        channelData: [Object],
        text: 'Adaptive Card',
        textFormat: 'plain',
        type: 'message',
        channelId: 'emulator',
        from: [Object],
        locale: 'en-US',
        localTimestamp: 2023-06-29T06:47:18.000Z,
        localTimezone: 'Africa/Lagos',
        timestamp: 2023-06-29T06:47:18.779Z,
        conversation: [Object],
        id: 'ca9cbcb0-1648-11ee-8e39-f122d31a0ca0',
        recipient: [Object],
        serviceUrl: 'http://localhost:51141',
        rawTimestamp: '2023-06-29T06:47:18.779Z',
        rawLocalTimestamp: '2023-06-29T07:47:18+01:00',
        callerId: null
      }
    },
    parent: <ref *1> DialogContext {
      services: TurnContextStateCollection(0) [Map] {},
      dialogs: DialogSet {
        dialogs: [Object],
        dialogState: undefined,
        _version: '-651942573'
      },
      context: TurnContext {
        _respondedRef: [Object],
        _turnState: [TurnContextStateCollection [Map]],
        _onSendActivities: [],
        _onUpdateActivity: [],
        _onDeleteActivity: [],
        _turn: 'turn',
        _locale: 'locale',
        bufferedReplyActivities: [],
        _adapter: [CloudAdapter],
        _activity: [Object]
      },
      parent: DialogContext {
        services: TurnContextStateCollection(0) [Map] {},
        dialogs: [DialogSet],
        context: [TurnContext],
        stack: [Array],
        state: [DialogStateManager]
      },
      stack: [ [Object], [Object] ],
      state: DialogStateManager {
        dialogContext: [Circular *1],
        configuration: [Object]
      }
    },
    stack: [ { id: 'waterfallDialog', state: [Object] } ],
    state: DialogStateManager {
      dialogContext: [Circular *2],
      configuration: { memoryScopes: [Array], pathResolvers: [Array] }
    },
    _info: {
      index: 4,
      options: { name: 'kol', email: 'kol' },
      reason: 'endCalled',
      result: {
        value: 'Adaptive Card',
        index: 0,
        score: 1,
        synonym: 'Adaptive Card'
      },
      values: { instanceId: 'd212da4c-83e3-4d18-8334-7e152901ff13' },
      onNext: [Function: onNext]
    }
  }