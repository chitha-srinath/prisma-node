/**
 * Centralized success message constants for the application.
 * Provides consistent success messages across all modules and endpoints.
 * Organized by feature area for better maintainability.
 */
export const SuccessMessages = {
  /**
   * Success messages for post-related operations.
   */
  POST: {
    CREATED: 'Post created successfully',
    UPDATED: 'Post updated successfully',
    DELETED: 'Post deleted successfully',
  },
  /**
   * Success messages for user-related operations.
   */
  USER: {
    CREATED: 'User created successfully',
    UPDATED: 'User updated successfully',
    DELETED: 'User deleted successfully',
  },
  /**
   * Success messages for token-related operations.
   */
  TOKEN: {
    GENERATED: 'Token generated successfully',
  },
  /**
   * Success messages for todo-related operations.
   */
  TODO: {
    CREATED: 'Todo created successfully',
    UPDATED: 'Todo updated successfully',
    DELETED: 'Todo deleted successfully',
  },
  /**
   * Success messages for authentication operations.
   */
  AUTH: {
    LOGIN_SUCCESSFULL: 'User login successful',
  },
};
