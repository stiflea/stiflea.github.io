package cn.itcast.web.servlet;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;

/*
* 如果前端加了enctype="multipart/form-data"  要加@MultipartConfig注解
*
* */
@WebServlet("/uploadServlet")
@MultipartConfig
public class UpLoadServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
       //设置编码格式
        req.setCharacterEncoding("UTF-8");
        //得上传文件对象
        Part part = req.getPart("filename");
        //得到文件名字
        String name = part.getSubmittedFileName();
            //得到文件存放路径
            String realPath = req.getServletContext().getRealPath("/images/");
            //实现文件上传
            part.write(realPath+name);

    }
}
