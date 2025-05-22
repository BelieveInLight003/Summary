### echo 
  用echo 在脚本中输出信息
  ```
  #!/bin/bash
  echo "Starting the script..."
  echo "Current date and time: $(date)"
  echo "Script finished."
  ```

### cp
  用cp命令复制文件或者目录
  cp [选项] 源文件 目标文件

    ```
    cp -r /path/to/source /path/to/destination 
    ```
    作用：递归复制目录及其所有子目录和文件。这两个参数功能相同，都用于处理目录复制。
    示例：cp -r source_dir dest_dir，将 source_dir 目录及其包含的所有子目录和文件复制到 dest_dir。

### mv
  1. 文件重命名
    mv oldfile.txt newfile.txt
  2. 目录重命名
    mv old_dir new_dir
  3. 文件移动
    mv file1.txt file2.txt /home/user/destination_dir
    移动多个文件 到 /home/user/destination_dir
  4. 移动目录
    mv source_dir /path/to/destination
    此命令会把 source_dir 目录（包含其内部的所有文件和子目录）移动到 /path/to/destination 目录下。
  

### sed
  sed（Stream Editor）是一种流编辑器，用于对文本进行过滤和转换。它可以对输入的文本进行逐行处理，执行诸如查找、替换、删除、插入等操作，并且可以通过正则表达式来匹配和处理文本。

  在gitlab-ci.yml 文件中，可以使用 sed 命令来修改文件中的某些内容。以下是一个示例：
  使用 s 命令进行文本替换，其基本语法为 s/原文本/新文本/修饰符。

  ```
  # 将文件中每行的第一个 "apple" 替换为 "banana"
  sed 's/apple/banana/' file.txt
  # 将文件中每行的所有 "apple" 替换为 "banana"，使用修饰符 g（global）
  sed 's/apple/banana/g' file.txt
  # 仅替换文件中第 2 行到第 5 行的 "apple" 为 "banana"
  sed '2,5s/apple/banana/g' file.txt
  ```
