function showWishlistWithId(wishlistId) {
  window.location.href = `/wishlists/${wishlistId}`;
}

window.addEventListener('load', () => {
  let images = [
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAJ4UlEQVR4nO2ce6wfRRXHV1oKyKMIBRWoRREEpEEkqNFSsJXyECVYHwhcqhhJRSVBRI2ijWilgGmC2mIxAQRRIxguQn0UMP2D4ouHgqAkSlterUof1Cq01vsxJ7+p2Xvu2d3Z3dn97f7Y7183uTNnvr/d2Zkz55z5RlGHDh06dOjQoUOHFgDYHTgd+AZwL/BX4F/Ac8CfgWuBmVFDAUwEZgOLgF8Dq4Hngc3AX4DvAidETQewNzAf2IAflgH7RA0BMAlY4CaOD+5qEv9RAN4KPEV+POu+mGl95n8s8HQB/uuBG4DjoqYAmAVspTxuAfboA/8TA/G/VZa7uvnrH3OwmyUaMtsuA04CXgPsKg8bOAr4KvCfhB/1oLStkf8hCUvsk275PQF4FfBSYDdgKnBpygv8fZ38rR8ksyKO/wLzgJ0y+r3XbfAWrq6R/7AaextwCTAho584LX9M4L+kLv6a1JHAiCJzfk4brwZuUza2yqysjvn/x36Dwf+8nDamGC9V+E+pjnkyGfl041he0M5OwGPK1qfDMx4z7lfUmHcVtDPB4H9xeMbZRMRHj+N9JWx9Vtm6Iyxbc8zfqDFnl7D1GWVraVi2fiTEZY1j3xK23qxsPRaWrTnmOjVm4TMF8Ka6+VvLTHz93QK8pIQ98WTi+FtYxpXzn1wnf4vAOOdRxTeyMj9oP/WDngnLuHb+T4dlXOyT372kxxPH/WHZVs7/qLr5WyQeUSQOKWFLDmBx/Cws29r5/zQsWz8SNyoSZ5ewdYGydWVYtuaYEoOKYygg/yvCsvUj8QlFYlEJWz9Stt4Tlq055sfVmItL2LpZ2To9LFs/EnMViRUlbEnOJI7TwrI1xzw/IP/H6+ZvkdCxnOtL2JLcSBzLwrL12kOuLWHrF8rWnWHZ+rmNcT9e/t6rhL3D+uD2jij+L2sLf9+Tehkv5Xhl6+GwbL34H1rC1oy6+VsklioSK4FjCia4nlG2rqmG9ahxb1djrpIQSAE7kvNZWzd/i8jZjMWKABuiYEY1rEeNeyZh+MtE1Di+GtbpRHYA7lZERvIsXcB048fc5DHuNJcIk/H/5LJ+Ev5YI4dK55Lv6mFnWUn+xxn8b4j6BfejvqUI3Zqj769U30sy2p9jeEdJWJtVbiTxK+Cbqt9wDv46hP/5qN8wPAzBGR79PqX6bEkKgbsSI5n5ebHNlevMTUorA4cX5H+xwX9S1ARI7EaR+zfwlpT273IPK47vJLTdy8jIFcHKJE4F+J9m8K9/I8+o3nhBEXzO+lHAu91simO9leCityzIDNd4wVUQysZ8qHtpE1xeYsg4+W+HVCBO9+S/SerNjLZnGVUn6xpXNAfMMYoGHjHWbO0iSknQiQk2P2g8VNnI98/gMtnNev3icS72bkafIYP/ox78tza2tBT4oiK7Uf1farPikAdwboq9R1X7O4HxOfjsAlxo1IFdlND+C6rdBg/+c6KmAnhFxguZqGdXiq3Xq7aypEwuyOtrPgkkD/57qv9viZoMI7e8Xv1fqv80zNQpvZkdxy0leE1RKdsRq+zTyO0/a1T2o+wUTv1WDuAgRfgJY5PW63SSO7pItbugJDe90R9ttHmtarO6KP++w63XN6Vt6q6dLvf/vhUpBn4cqm7K2btH2Rt1aHT1u8IlNUho8F/UqJfiPuOPJriaC432unR0u4t5uRzSUrKIhQvxnL3lVrzMLaMfMwKcZioWuM5oJ3XK5/at0Np9ujPd3Q55mCRUwE9KONkn9RH8QUIQRjQ2V92th8d2ocury82oJP4TE1YCqdK3sFEOuC6dsEMZvnk27Us9LufINbAjUuwcnTAj0zAvcP4jDXId4XUptvY3XrDGEy4Aul8Z3kkEpro1XYcLNMTfv9on++Zc4AVuVvlgaQn++xqbsYUtbk/Y08Om7DlXptx1iT+TH5ZJgOnPc6FyGS3IF/PlIucEt4Z/2IXCt6WMsa6oiylVLB6zWS4SHVDA9oHucs8ajxczv7AD4GaVDi/HscnFk+RK2LhCg9gHs09KoihhRhe6N+IetsZmt4fMDLHeAzsCp7h6tX+mPLflufP37gqaXM+yIBvaeVY8KCQYe7qWL2SXEnE2jYPCsx7leYrn9nDCM1yR60tx3pO10WXmCUIB+J4af24JWxIUfEDZOzYs48Rx5yQsZwt9jbzR2DNuL1OMXASMzeTNK+mma68u0QsMDRcDu9uIEmeni4Fvq4735fm8Qikh0Ms76KTR53x5xOzsY5zSNybtG1UpOTjnRfL/cVzu01GfMd7RDyUEekknfWVZNvoDcz4IuZ6deVO2DiUHiTZkhZasTmvVaXVcv5QQ6DkP2hX+Uo4HMN65tHGs1oe1upQc3DEifkB90KfTmc6l3eRThV61EgK9kh+93LzS8wFcpPr+Dti5Tv4Gp9nu5a/0rt/y3TPqUkJgbOxoOOuQ6HLtm9PiYYOo5FCLEgK9fLfGghT7L3cbcGoufdCUHGpTQqDnz2tPSTA/IfBnyXac1S/+taBuJQR6kWYrQnykaneV51c3cEoOtSsh0Avb6zX/JNXmDuNQO/7FoOTQFyUExmb+Ts6oQjQfdKfkEEgJgV5gLo5Z6v860zgm/tYpOeRXQliT0lbOEnG8Tf1fkkFxfCjhwBhHp+SQoeTwUMLLGDJO7lNVmyU+N6OMM0pIJYoHorpRsRLCz5XLOyPB7ZW4247K1vuxIXvLqdvPGEY4vvVKDlUqIVwmRQbONbWuvOHOEB/wvNkVh3hp1xtL31CblCiqVkLQNVh/Jx3b0g5xLtTxE/JhcZuUKOpWQkjDCqsMNEVsMymNqvHLtis5VKmEoPG8856mF7Q/zZUn/YNqvpBGKjmEVELYjnvd/cDMOqkclSEnG/vfSJESoKYrOYRUQng8SGHZi0zJoUolhCXVsB5sJYcqlRDeXg3rwVdyqEIJ4cZqmQ+2kkOrlRBoOf9oEJUQaDn/aBCVEGg5/2jQlBBoOX8TbVdCoOX8o0FUQqDl/H2UEDa0SQmBlvP3yY23SgmBlvOPBk0JgZbzt5JCPyighLC4CT+K4vwbp+Swh7tPZ8V0vt50JQRazj+eD5nlbhMlKSFIBfneTVRCoOX8dXHxfA8VhlVx3RLDzgHG9a7KlRDazl/XHQ17KDlsbaISAi3nrwe9ykPJ4Uk3GxqlhEDL+VuHJF27pNfL61yR2LimKSHQcv6RcQB6KMGgXJP+SJUeBSWVENrO3zIo3gfG7dVSImJ1KSHQcv7ayDHGaXS4am2TUEoItJy/1fka1fG3TTiJ4qmE0Hb+Vsc1RZQc6gAeSght558lreGl5FAX8FBCaDt/q9OpLq4jp9VTooaBnhLCU0lKCI7/KtfmnVHL+Hfo0KFDhw4dOnSIKsD/AKGhICjo3J0dAAAAAElFTkSuQmCC',
    'data:image/png;base64,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',
    'data:image/png;base64,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',
  ];

  let ids = [
    'public-wishlist__as-id',
    'friends-wishlist__as-id',
    'private-wishlist__as-id',
  ];

  let infoContents = [
    'Content of this wishlist is visible for everyone',
    "Content of this wishlist is visible only for owner's friends",
    'Content of this wishlist is visible only for owner',
  ];

  for (let i = 0; i < 3; i++) {
    let button = document.getElementById(ids[i]);
    let h2 = button.querySelector('h2');
    let img = document.createElement('img');
    img.src = images[i];
    img.classList.add('wishlist-item__privacy-icon');
    h2.insertAdjacentElement('afterend', img);

    let textElement = button.querySelector('.tooltiptext');
    textElement.textContent = infoContents[i];
  }

  let button = document.getElementById('friends-wishlist__as-id');
  let h2 = button.querySelector('h2');
  h2.textContent = 'FOR FRIENDS';
});
