### git cherry-pick
##### cherry-pick 的主要作用是将某个或某些提交从一个分支复制到当前分支，而无需将整个分支合并。这种操作特别适用于以下场景：

- 快速修复迁移：将开发分支的 bug 修复直接应用到主分支，无需等待完整的分支合并。
- 挑选特定功能：仅复制某些完成的特性，而不是整个分支。
- 避免复杂冲突：直接挑选需要的提交，避免合并整个分支时可能引发的大量冲突。


### 使用
###### git cherry-pick <commit-id> 基础
```
# 先切换到目标分支（要接收提交的分支）
git checkout main

# 复制指定提交
git cherry-pick abc123
```
###### 挑选多个连续提交
```
# 复制从 commitA 到 commitB（包含两者）的所有提交
git cherry-pick commitA..commitB
```

###### 挑选多个不连续提交
```
git cherry-pick <提交1> <提交2> <提交3>
```

###### 放弃正在进行的 cherry-pick（如果遇到冲突且想中止）
```
# 解决冲突后
git add .
git cherry-pick --continue
```

###### 继续解决冲突后的 cherry-pick
```
# 解决冲突后
git add .
git cherry-pick --continue
```