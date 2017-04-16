USER_FIELDS = ['username', 'steamid']


def create_user(strategy, details, backend, user=None, *args, **kwargs):
    # import ipdb; ipdb.set_trace()
    print('details', details)
    print('kwargs', kwargs)
    if user:
        return {'is_new': False}

    fields = dict((name, kwargs.get(name, details.get(name)))
                  for name in backend.setting('USER_FIELDS', USER_FIELDS))

    print('fields', fields)
    if not fields:
        return

    return {
        'is_new': True,
        'user': strategy.create_user(**fields)
    }
