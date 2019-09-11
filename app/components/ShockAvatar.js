/**
 * @format
 */
import React from 'react'

import { Avatar } from 'react-native-elements'

const DEFAULT_USER_IMAGE =
  'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjBxkUMxbYpdxEAAAC5UlEQVRo3s2ZW0gUURiAv90ldc1LappZ6S5UEpRFD0IRmUgRIRUU+tC7D2UUvUaP0XtBUFnQ5a2HboQFUWBPUhJdRDAjgyLdIm9lmO2eHkqx2Zmd/8yeY/3nbebs+b7zz5yZf86GCBL17KSelVRQBIyTYIBuOnkaaDTN2MsLlEd7zm678DyuecJn2mVybeEj3PXFKxS3CdsROCHCKxTHbeBr+C4WmGS5dFh5strJE/eNcsh8Bt6K569QvDaNX6WFVyjisoGll6BBW3mbWYHVAXJmVCCmLSD8hVRAvKxmY4VZgQJtgYVmBfSf71GzAjnaAkJlqcC4tsCoWYFP2gIJswLC4fSVpQI92gKGy7ON2u+COrMCYT5r4YeluZVeghQXtYQ7SJnNACxjSjz/HwEe3YI4JxY4awMPRQyK8IMU2hGAJqZ98dM02sID7PdR+MkBm3iAFr564ifYZxsPEOOBK75LWoZlHyGaucXknA+Rm+wiFGyo4LGAWiqBj/QzPT8zj7CeNio9zy+ljToi5sE57OAUj5hAoXjvsdCa+PDnVnzISbYHqKJcIkQjVxlPu+E6aaVitlcFrdxP6zPKFRqyusjs4VnGVT9EL70MZezTQ3MweBk3tGsAr3adUl18nH5jeIWijxod/CL6jOIVilcUywUuGccrFOel+A2krAik3OpEt5LsWHZLxzNCHHU76Iw8EtYKignKmfLLwFZ79QyFbHEeShfYbA0PsMlfYI1VgXX+AjGrAtX/WiBt48a5CqJ8s7QIf0eS6N/FizMD5VbxEJnzEncVyLeKh7TNq3Dm0xbCMcX5z8D/LiD/T8CSgJFKNmM4CE6BpHUBn52TXB5bKUZmWpd/jgu4Yw1/jyJJkiIcYcw4fIzDOh9tVZxx+R4KDj9Nlf7tUkg7T0hmhU7SzcHsaqzFtNLBG230ABdoocxvePm7r5i11FJNnCWUUkIJYXLJByaZIsUIXxhhiEHe0c9L6Qb/Lzm7beRqeYV3AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA3LTI1VDE4OjUxOjIyKzAyOjAwFmPwLQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wNy0yNVQxODo1MToyMiswMjowMGc+SJEAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC'

/**
 * @param {string} displayName
 * @returns {string|null}
 */
const getInitials = displayName => {
  if (displayName.length === 0) {
    return null
  }

  const words = displayName
    .trim()
    .toUpperCase()
    .split(' ')

  if (words.length === 1) {
    return words[0][0]
  }

  return words[0][0] + words[1][0]
}

/**
 * @typedef {object} Props
 * @prop {string|null} displayName
 * @prop {number} height
 * @prop {string|null} image
 */

/**
 * @augments React.PureComponent<Props>
 */
export default class ShockAvatar extends React.PureComponent {
  render() {
    const { displayName, height, image } = this.props

    const initials = displayName && getInitials(displayName)

    // const source =

    return (
      <Avatar
        height={height}
        rounded
        source={
          image === null || image.length === 0
            ? initials
              ? undefined
              : {
                  uri: 'data:image/png;base64,' + DEFAULT_USER_IMAGE,
                }
            : {
                uri: 'data:image/png;base64,' + image,
              }
        }
        title={initials ? initials : undefined}
      />
    )
  }
}
