const bcrypt = require("bcrypt");
const helperError = require("../helper/error");
const express = require("express");
const expressValidator = require("express-validator");
const jsonWebToken = require("jsonwebtoken");
const jwtMiddleware = require("../middlewares/jwt.middleware");
const sequelize = require("sequelize");

/**
 *
 * @param {express.Router} router
 * @param {sequelize.Sequelize} db
 * @param {string} jwtKey
 */
module.exports = function (router, db, jwtKey) {
  const userModel = db.models.User;
  const todoModel = db.models.Todo;

  router.post(
    "",
    jwtMiddleware(jwtKey, userModel),
    expressValidator
      .body("name")
      .exists()
      .withMessage("field name is required")
      .isString()
      .withMessage("field name must be a string")
      .isLength({ min: 1, max: 128 })
      .withMessage("field name minimum length is 1 and maximum length is 128"),
    expressValidator
      .body("description")
      .exists()
      .withMessage("field description is required")
      .isString()
      .withMessage("field description must be a string")
      .isLength({ min: 1, max: 256 })
      .withMessage(
        "field description minimum length is 1 and maximum length is 256"
      ),
    async function (req, res) {
      const user = req.user;
      if (!user) {
        return res.status(500).json({ error: "something wrong" });
      }
      const errors = expressValidator.validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: helperError.convertValidatorErrors(errors.array()) });
      }
      const reqBody = req.body;

      try {
        const todo = await todoModel.create({
          name: reqBody.name,
          description: reqBody.description,
          userId: user.id,
        });

        return res.status(201).json({
          data: {
            id: todo.id,
            name: todo.name,
            description: todo.description,
            completed: todo.completed,
            createdAt: todo.createdAt,
            updatedAt: todo.updatedAt,
          },
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "something wrong" });
      }
    }
  );

  router.get("", jwtMiddleware(jwtKey, userModel), async function (req, res) {
    const user = req.user;
    if (!user) {
      return res.status(500).json({ error: "something wrong" });
    }
    const todos = await todoModel.findAll({ where: { userId: user.id } });
    const todosData = [];
    todos.forEach(function (todo) {
      todosData.push({
        id: todo.id,
        name: todo.name,
        description: todo.description,
        completed: todo.completed,
      });
    });
    return res.json({
      data: todosData,
    });
  });

  router.get(
    "/:id",
    jwtMiddleware(jwtKey, userModel),
    expressValidator
      .param("id")
      .exists()
      .withMessage("parameter id is required")
      .isInt()
      .withMessage("parameter id must be a number (integer)")
      .toInt(),
    async function (req, res) {
      const user = req.user;
      if (!user) {
        return res.status(500).json({ error: "something wrong" });
      }
      const errors = expressValidator.validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: helperError.convertValidatorErrors(errors.array()) });
      }
      const todoId = req.params.id;
      if (isNaN(todoId))
        return res.status(200).json({
          error: "bad parameter id",
        });

      const todo = await todoModel.findOne({
        where: { id: todoId },
      });
      if (todo === null || !todo)
        return res.status(404).json({
          error: `todo with id ${todoId} is not exist`,
        });
      if (todo.userId !== user.id) {
        return res.status(401).json({
          error: `you don't have permissions to get this todo`,
        });
      }

      const todoData = {
        id: todo.id,
        name: todo.name,
        description: todo.description,
        completed: todo.completed,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      };
      return res.json({
        data: todoData,
      });
    }
  );

  router.patch(
    "/:id",
    jwtMiddleware(jwtKey, userModel),
    expressValidator
      .param("id")
      .exists()
      .withMessage("parameter id is required")
      .isInt()
      .withMessage("parameter id must be a number (integer)")
      .toInt(),
    expressValidator
      .body("name")
      .optional()
      .isString()
      .withMessage("field name must be a string")
      .isLength({ min: 1, max: 128 })
      .withMessage("field name minimum length is 1 and maximum length is 128"),
    expressValidator
      .body("description")
      .optional()
      .isString()
      .withMessage("field description must be a string")
      .isLength({ min: 1, max: 256 })
      .withMessage(
        "field description minimum length is 1 and maximum length is 256"
      ),
    async function (req, res) {
      const user = req.user;
      if (!user) {
        return res.status(500).json({ error: "something wrong" });
      }

      const errors = expressValidator.validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: helperError.convertValidatorErrors(errors.array()) });
      }
      const todoId = req.params.id;
      if (isNaN(todoId))
        return res.status(200).json({
          error: "bad parameter id",
        });
      const reqBody = req.body;

      const todo = await todoModel.findOne({
        where: { id: todoId },
      });
      if (todo === null || !todo)
        return res.status(404).json({
          error: `todo with id ${todoId} is not exist`,
        });
      if (todo.userId !== user.id) {
        return res.status(401).json({
          error: `you don't have permissions to get this todo`,
        });
      }

      const updated = {};
      if (reqBody.name) todo.name = reqBody.name;
      if (reqBody.description) todo.description = reqBody.description;
      await todo.save();

      const todoData = {
        id: todo.id,
        name: todo.name,
        description: todo.description,
        completed: todo.completed,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      };
      return res.json({
        data: todoData,
      });
    }
  );

  router.patch(
    "/:id/complete",
    jwtMiddleware(jwtKey, userModel),
    expressValidator
      .param("id")
      .exists()
      .withMessage("parameter id is required")
      .isInt()
      .withMessage("parameter id must be a number (integer)")
      .toInt(),
    async function (req, res) {
      const user = req.user;
      if (!user) {
        return res.status(500).json({ error: "something wrong" });
      }

      const errors = expressValidator.validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: helperError.convertValidatorErrors(errors.array()) });
      }
      const todoId = req.params.id;
      if (isNaN(todoId))
        return res.status(200).json({
          error: "bad parameter id",
        });
      const reqBody = req.body;

      const todo = await todoModel.findOne({
        where: { id: todoId },
      });
      if (todo === null || !todo)
        return res.status(404).json({
          error: `todo with id ${todoId} is not exist`,
        });
      if (todo.userId !== user.id) {
        return res.status(401).json({
          error: `you don't have permissions to get this todo`,
        });
      }

      const updated = {};
      const newTodo = (
        await todoModel.update(
          { completed: true },
          {
            where: { id: todo.id },
            returning: true,
          }
        )
      )[1][0].dataValues;

      const todoData = {
        id: newTodo.id,
        name: newTodo.name,
        description: newTodo.description,
        completed: newTodo.completed,
        createdAt: newTodo.createdAt,
        updatedAt: newTodo.updatedAt,
      };
      return res.json({
        data: todoData,
      });
    }
  );

  router.patch(
    "/:id/uncomplete",
    jwtMiddleware(jwtKey, userModel),
    expressValidator
      .param("id")
      .exists()
      .withMessage("parameter id is required")
      .isInt()
      .withMessage("parameter id must be a number (integer)")
      .toInt(),
    async function (req, res) {
      const user = req.user;
      if (!user) {
        return res.status(500).json({ error: "something wrong" });
      }

      const errors = expressValidator.validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: helperError.convertValidatorErrors(errors.array()) });
      }
      const todoId = req.params.id;
      if (isNaN(todoId))
        return res.status(200).json({
          error: "bad parameter id",
        });
      const reqBody = req.body;

      const todo = await todoModel.findOne({
        where: { id: todoId },
      });
      if (todo === null || !todo)
        return res.status(404).json({
          error: `todo with id ${todoId} is not exist`,
        });
      if (todo.userId !== user.id) {
        return res.status(401).json({
          error: `you don't have permissions to get this todo`,
        });
      }

      const updated = {};
      const newTodo = (
        await todoModel.update(
          { completed: false },
          {
            where: { id: todo.id },
            returning: true,
          }
        )
      )[1][0].dataValues;

      const todoData = {
        id: newTodo.id,
        name: newTodo.name,
        description: newTodo.description,
        completed: newTodo.completed,
        createdAt: newTodo.createdAt,
        updatedAt: newTodo.updatedAt,
      };
      return res.json({
        data: todoData,
      });
    }
  );

  router.delete(
    "/:id",
    jwtMiddleware(jwtKey, userModel),
    expressValidator
      .param("id")
      .exists()
      .withMessage("parameter id is required")
      .isInt()
      .withMessage("parameter id must be a number (integer)")
      .toInt(),
    async function (req, res) {
      const user = req.user;
      if (!user) {
        return res.status(500).json({ error: "something wrong" });
      }

      const errors = expressValidator.validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: helperError.convertValidatorErrors(errors.array()) });
      }
      const todoId = req.params.id;
      if (isNaN(todoId))
        return res.status(200).json({
          error: "bad parameter id",
        });

      const todo = await todoModel.findOne({
        where: { id: todoId },
      });
      if (todo === null || !todo)
        return res.status(404).json({
          error: `todo with id ${todoId} is not exist`,
        });
      if (todo.userId !== user.id) {
        return res.status(401).json({
          error: `you don't have permissions to get this todo`,
        });
      }

      await todoModel.destroy({
        where: { email: todo.id },
      });

      const todoData = {
        id: todo.id,
        name: todo.name,
        description: todo.description,
        completed: todo.completed,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      };
      return res.json({
        data: todoData,
      });
    }
  );
};
