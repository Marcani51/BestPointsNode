import { Response, Request, NextFunction } from "express";
import { Place } from "../models/place";
import { Review } from "../models/review";
import { User } from "../models/user";

export async function store(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registUser = await User.register(user, password);
    req.login(registUser, (err: any) => {
      //@ts-ignore
      if (err) return next(err);
      req.flash("succes_msg", "You are registered and can login");
      res.redirect("/places");
    });
  } catch (error: any) {
    req.flash("error_msg", error.message);
    res.redirect("/register");
  }
}

export function registerForm(req: Request, res: Response, next: NextFunction) {
  res.render("auth/register");
}

export function login(req: Request, res: Response, next: NextFunction) {
  req.flash("succes_msg", "Your are log in");
  res.redirect("/places");
}

export function logout(req: Request, res: Response, next: NextFunction) {
  req.logout(function (err: any) {
    if (err) {
      return next(err);
    }
    req.flash("succes_msg", "You are log out");
    res.redirect("/login");
  });
}
